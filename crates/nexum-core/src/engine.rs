use serde::Serialize;

use nexum_schema::{Mode, OnError};

use crate::adapter::Capability;
use crate::bus::{EngineEvent, EventBus};
use crate::error::AdapterError;
use crate::registry::ActionRegistry;

/// How a step ended. `Unavailable` means it could not run on this machine
/// (integration turned off, OS not supported, device not paired), as opposed
/// to `Failed`, where it ran and went wrong.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
#[serde(rename_all = "snake_case")]
#[cfg_attr(feature = "ts", derive(ts_rs::TS))]
#[cfg_attr(
    feature = "ts",
    ts(export, export_to = "../../../packages/schema-ts/src/generated/")
)]
pub enum StepStatus {
    Ok,
    Failed,
    Unavailable,
}

/// Outcome of a single step, surfaced to the UI and persisted as a log.
#[derive(Debug, Clone, Serialize)]
#[cfg_attr(feature = "ts", derive(ts_rs::TS))]
#[cfg_attr(
    feature = "ts",
    ts(export, export_to = "../../../packages/schema-ts/src/generated/")
)]
pub struct StepReport {
    pub order: u32,
    pub action_type: String,
    /// `status == Ok`, kept for existing consumers.
    pub success: bool,
    pub status: StepStatus,
    pub message: String,
}

/// Full result of activating a mode.
#[derive(Debug, Clone, Serialize)]
#[cfg_attr(feature = "ts", derive(ts_rs::TS))]
#[cfg_attr(
    feature = "ts",
    ts(export, export_to = "../../../packages/schema-ts/src/generated/")
)]
pub struct ExecutionReport {
    pub mode_id: String,
    pub success: bool,
    pub steps: Vec<StepReport>,
}

/// Whether an action_type can run on this machine right now.
#[derive(Debug, Clone, Serialize)]
#[cfg_attr(feature = "ts", derive(ts_rs::TS))]
#[cfg_attr(
    feature = "ts",
    ts(export, export_to = "../../../packages/schema-ts/src/generated/")
)]
pub struct ActionAvailability {
    pub action_type: String,
    pub available: bool,
    /// Why it is unavailable; `None` when available.
    pub reason: Option<String>,
}

/// Orchestrates mode execution. Holds a registry of adapters and an event bus.
pub struct Engine {
    registry: ActionRegistry,
    bus: EventBus,
}

impl Engine {
    pub fn new(registry: ActionRegistry, bus: EventBus) -> Self {
        Self { registry, bus }
    }

    /// Subscribe to this engine's event stream.
    pub fn bus(&self) -> &EventBus {
        &self.bus
    }

    /// Every action_type the registered adapters can handle. Used as the
    /// Marketplace allowlist and to populate the no-code editor's catalog.
    pub fn action_types(&self) -> Vec<String> {
        let mut types = self.registry.known_action_types();
        types.sort();
        types
    }

    /// Availability of every known action_type, so the UI can flag steps that
    /// will be skipped before the user runs a mode.
    pub async fn availability(&self) -> Vec<ActionAvailability> {
        let mut out = Vec::new();
        for action_type in self.action_types() {
            let capability = match self.registry.resolve(&action_type) {
                Some(adapter) => adapter.is_available().await,
                None => continue,
            };
            out.push(match capability {
                Capability::Available => ActionAvailability {
                    action_type,
                    available: true,
                    reason: None,
                },
                Capability::Unavailable { reason } => ActionAvailability {
                    action_type,
                    available: false,
                    reason: Some(reason),
                },
            });
        }
        out
    }

    /// Activate a mode: run every enabled step in `order`, resolving each
    /// step's adapter from the registry. Failures are captured per step and
    /// honor the step's `on_error` policy. The returned report never hides a
    /// failure — the whole activation is `success` only if every step was.
    pub async fn activate(&self, mode: &Mode) -> ExecutionReport {
        self.bus.emit(EngineEvent::ModeStarted {
            mode_id: mode.id.to_string(),
            name: mode.name.clone(),
        });

        let mut steps = Vec::new();
        let mut overall_ok = true;

        for step in mode.ordered_steps() {
            if !step.enabled {
                continue;
            }

            self.bus.emit(EngineEvent::StepStarted {
                action_type: step.action_type.clone(),
                order: step.order,
            });

            let (status, message) = match self.registry.resolve(&step.action_type) {
                None => (
                    StepStatus::Unavailable,
                    format!("no adapter registered for '{}'", step.action_type),
                ),
                Some(adapter) => match adapter.is_available().await {
                    Capability::Unavailable { reason } => (
                        StepStatus::Unavailable,
                        format!("adapter unavailable: {reason}"),
                    ),
                    Capability::Available => match adapter.execute(step).await {
                        Ok(outcome) if outcome.success => (StepStatus::Ok, outcome.message),
                        Ok(outcome) => (StepStatus::Failed, outcome.message),
                        Err(err @ AdapterError::Unavailable(_)) => {
                            (StepStatus::Unavailable, err.to_string())
                        }
                        Err(err) => (StepStatus::Failed, err.to_string()),
                    },
                },
            };
            let success = status == StepStatus::Ok;

            if !success {
                overall_ok = false;
            }

            self.bus.emit(EngineEvent::StepFinished {
                action_type: step.action_type.clone(),
                order: step.order,
                success,
                status,
                message: message.clone(),
            });

            steps.push(StepReport {
                order: step.order,
                action_type: step.action_type.clone(),
                success,
                status,
                message,
            });

            if !success && step.on_error == OnError::Abort {
                break;
            }
        }

        self.bus.emit(EngineEvent::ModeFinished {
            mode_id: mode.id.to_string(),
            success: overall_ok,
        });

        ExecutionReport {
            mode_id: mode.id.to_string(),
            success: overall_ok,
            steps,
        }
    }
}

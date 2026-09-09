use serde::Serialize;

use nexum_schema::{Mode, OnError};

use crate::adapter::ExecContext;
use crate::bus::{EngineEvent, EventBus};
use crate::registry::ActionRegistry;

/// Outcome of a single step, surfaced to the UI and persisted as a log.
#[derive(Debug, Clone, Serialize)]
#[cfg_attr(feature = "ts", derive(ts_rs::TS))]
#[cfg_attr(feature = "ts", ts(export, export_to = "../../packages/schema-ts/src/generated/"))]
pub struct StepReport {
    pub order: u32,
    pub action_type: String,
    pub success: bool,
    pub message: String,
}

/// Full result of activating a mode.
#[derive(Debug, Clone, Serialize)]
#[cfg_attr(feature = "ts", derive(ts_rs::TS))]
#[cfg_attr(feature = "ts", ts(export, export_to = "../../packages/schema-ts/src/generated/"))]
pub struct ExecutionReport {
    pub mode_id: String,
    pub success: bool,
    pub steps: Vec<StepReport>,
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

    /// Activate a mode: run every enabled step in `order`, resolving each
    /// step's adapter from the registry. Failures are captured per step and
    /// honor the step's `on_error` policy. The returned report never hides a
    /// failure — the whole activation is `success` only if every step was.
    pub async fn activate(&self, mode: &Mode, ctx: &ExecContext) -> ExecutionReport {
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

            let (success, message) = match self.registry.resolve(&step.action_type) {
                None => (false, format!("no adapter registered for '{}'", step.action_type)),
                Some(adapter) => match adapter.execute(step, ctx).await {
                    Ok(outcome) => (outcome.success, outcome.message),
                    Err(err) => (false, err.to_string()),
                },
            };

            if !success {
                overall_ok = false;
            }

            self.bus.emit(EngineEvent::StepFinished {
                action_type: step.action_type.clone(),
                order: step.order,
                success,
                message: message.clone(),
            });

            steps.push(StepReport {
                order: step.order,
                action_type: step.action_type.clone(),
                success,
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

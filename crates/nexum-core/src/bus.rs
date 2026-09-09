use serde::Serialize;
use tokio::sync::broadcast;

/// Real-time events emitted while a mode runs. Subscribers (UI, logs, the
/// cloud sync queue) react without the engine knowing they exist.
#[derive(Debug, Clone, Serialize)]
#[cfg_attr(feature = "ts", derive(ts_rs::TS))]
#[cfg_attr(feature = "ts", ts(export, export_to = "../../packages/schema-ts/src/generated/"))]
#[serde(tag = "kind", rename_all = "snake_case")]
pub enum EngineEvent {
    ModeStarted { mode_id: String, name: String },
    StepStarted { action_type: String, order: u32 },
    StepFinished { action_type: String, order: u32, success: bool, message: String },
    ModeFinished { mode_id: String, success: bool },
}

/// Thin wrapper over a Tokio broadcast channel.
#[derive(Clone)]
pub struct EventBus {
    tx: broadcast::Sender<EngineEvent>,
}

impl EventBus {
    pub fn new() -> Self {
        let (tx, _rx) = broadcast::channel(256);
        Self { tx }
    }

    /// Subscribe to receive every event emitted from now on.
    pub fn subscribe(&self) -> broadcast::Receiver<EngineEvent> {
        self.tx.subscribe()
    }

    /// Emit an event. Errors (no active subscribers) are intentionally ignored.
    pub fn emit(&self, event: EngineEvent) {
        let _ = self.tx.send(event);
    }
}

impl Default for EventBus {
    fn default() -> Self {
        Self::new()
    }
}

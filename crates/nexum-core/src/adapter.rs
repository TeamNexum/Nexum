use async_trait::async_trait;
use nexum_schema::ActionStep;

use crate::error::AdapterError;

/// Whether an adapter's underlying hardware/API is usable on this machine
/// right now (e.g. is a Hue bridge reachable? is PipeWire running?).
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum Capability {
    Available,
    Unavailable { reason: String },
}

/// Result of executing a single action. `success = false` is a *soft* failure
/// (the action ran but didn't achieve its goal); a hard error returns
/// [`AdapterError`] instead.
#[derive(Debug, Clone)]
pub struct ActionOutcome {
    pub action_type: String,
    pub success: bool,
    pub message: String,
}

/// Every integration (System, Audio, Gaming, IoT, ...) implements this trait.
/// Adding a new integration means writing one `Adapter` and registering it —
/// the engine never changes. This is the seam for the future plugin SDK.
#[async_trait]
pub trait Adapter: Send + Sync {
    /// The `action_type`s this adapter can handle (e.g. `["audio.set_volume"]`).
    fn supported_actions(&self) -> Vec<String>;

    /// Is the underlying hardware/API usable right now?
    async fn is_available(&self) -> Capability;

    /// Validate params without side effects.
    fn validate(&self, step: &ActionStep) -> Result<(), AdapterError>;

    /// Execute the action.
    async fn execute(&self, step: &ActionStep) -> Result<ActionOutcome, AdapterError>;
}

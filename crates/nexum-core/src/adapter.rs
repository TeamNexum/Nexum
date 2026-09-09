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

/// Runtime context handed to adapters. Extend with user/device/cloud handles
/// as the project grows.
#[derive(Debug, Default, Clone)]
pub struct ExecContext {
    /// When true, adapters must validate and report but perform NO side effects.
    /// This powers the "simulation" step of AI Mode-as-Code and previews.
    pub dry_run: bool,
}

/// Every integration (System, Audio, Gaming, IoT, ...) implements this trait.
/// Adding a new integration means writing one `Adapter` and registering it —
/// the engine never changes. This is the seam for the future plugin SDK.
#[async_trait]
pub trait Adapter: Send + Sync {
    /// Human-readable name, for logs.
    fn name(&self) -> &str;

    /// The `action_type`s this adapter can handle (e.g. `["audio.set_volume"]`).
    fn supported_actions(&self) -> Vec<String>;

    /// Is the underlying hardware/API usable right now?
    async fn is_available(&self) -> Capability;

    /// Validate params without side effects (used for previews and risk scoring).
    fn validate(&self, step: &ActionStep) -> Result<(), AdapterError>;

    /// Execute the action for real (unless `ctx.dry_run`).
    async fn execute(
        &self,
        step: &ActionStep,
        ctx: &ExecContext,
    ) -> Result<ActionOutcome, AdapterError>;
}

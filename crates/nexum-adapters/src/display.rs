use async_trait::async_trait;

use nexum_core::{ActionOutcome, Adapter, AdapterError, Capability, ExecContext};
use nexum_schema::action_types::{ids, SetBrightnessParams};
use nexum_schema::ActionStep;

use crate::util::deser;

/// Set display brightness.
///
/// TODO(nexum, Phase 0): real per-OS implementation. The prototype used the
/// `brightness` crate (works Win/Linux/macOS) — reintroduce it here once we
/// confirm it builds in CI (Linux needs libdbus). For now this validates
/// params and reports Unavailable so the slot is wired but honest.
pub struct DisplayAdapter;

impl DisplayAdapter {
    pub fn new() -> Self {
        Self
    }
}

impl Default for DisplayAdapter {
    fn default() -> Self {
        Self::new()
    }
}

#[async_trait]
impl Adapter for DisplayAdapter {
    fn name(&self) -> &str {
        "display"
    }

    fn supported_actions(&self) -> Vec<String> {
        vec![ids::DISPLAY_SET_BRIGHTNESS.into()]
    }

    async fn is_available(&self) -> Capability {
        Capability::Unavailable {
            reason: "brightness control not yet implemented".into(),
        }
    }

    fn validate(&self, step: &ActionStep) -> Result<(), AdapterError> {
        let p: SetBrightnessParams = deser(step)?;
        if p.percent > 100 {
            return Err(AdapterError::InvalidParams {
                action_type: step.action_type.clone(),
                reason: "percent must be between 0 and 100".into(),
            });
        }
        Ok(())
    }

    async fn execute(
        &self,
        step: &ActionStep,
        _ctx: &ExecContext,
    ) -> Result<ActionOutcome, AdapterError> {
        self.validate(step)?;
        Err(AdapterError::Unavailable(
            "brightness control not yet implemented (Phase 0 TODO)".into(),
        ))
    }
}

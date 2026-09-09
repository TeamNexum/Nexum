use async_trait::async_trait;

use nexum_core::{ActionOutcome, Adapter, AdapterError, Capability, ExecContext};
use nexum_schema::ActionStep;

/// An adapter that "succeeds" for a configurable set of action_types, echoing
/// the params. It lets the desktop demo run a full mode end-to-end while the
/// real integrations (Hue, RGB, brightness...) are still being built.
pub struct MockAdapter {
    actions: Vec<String>,
}

impl MockAdapter {
    pub fn new(actions: Vec<String>) -> Self {
        Self { actions }
    }
}

#[async_trait]
impl Adapter for MockAdapter {
    fn name(&self) -> &str {
        "mock"
    }

    fn supported_actions(&self) -> Vec<String> {
        self.actions.clone()
    }

    async fn is_available(&self) -> Capability {
        Capability::Available
    }

    fn validate(&self, _step: &ActionStep) -> Result<(), AdapterError> {
        Ok(())
    }

    async fn execute(
        &self,
        step: &ActionStep,
        _ctx: &ExecContext,
    ) -> Result<ActionOutcome, AdapterError> {
        Ok(ActionOutcome {
            action_type: step.action_type.clone(),
            success: true,
            message: format!("[mock] {} {}", step.action_type, step.params),
        })
    }
}

use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;

use async_trait::async_trait;

use nexum_core::{ActionOutcome, Adapter, AdapterError, Capability};
use nexum_schema::ActionStep;

/// Wraps an adapter so the user can turn its integration off. While disabled it
/// reports [`Capability::Unavailable`], so the engine skips its steps with a
/// clear reason instead of running them. The flag is shared, so flipping it
/// takes effect on the next activation without rebuilding the engine.
pub struct Switchable {
    inner: Arc<dyn Adapter>,
    enabled: Arc<AtomicBool>,
}

impl Switchable {
    pub fn new(inner: Arc<dyn Adapter>, enabled: Arc<AtomicBool>) -> Self {
        Self { inner, enabled }
    }
}

#[async_trait]
impl Adapter for Switchable {
    fn supported_actions(&self) -> Vec<String> {
        self.inner.supported_actions()
    }

    async fn is_available(&self) -> Capability {
        if !self.enabled.load(Ordering::Relaxed) {
            return Capability::Unavailable {
                reason: "disabled by the user".into(),
            };
        }
        self.inner.is_available().await
    }

    fn validate(&self, step: &ActionStep) -> Result<(), AdapterError> {
        self.inner.validate(step)
    }

    async fn execute(&self, step: &ActionStep) -> Result<ActionOutcome, AdapterError> {
        if !self.enabled.load(Ordering::Relaxed) {
            return Err(AdapterError::Unavailable("disabled by the user".into()));
        }
        self.inner.execute(step).await
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::SystemAdapter;

    #[tokio::test]
    async fn disabled_integration_is_unavailable_until_reenabled() {
        let enabled = Arc::new(AtomicBool::new(false));
        let adapter = Switchable::new(Arc::new(SystemAdapter::new()), enabled.clone());
        assert!(matches!(
            adapter.is_available().await,
            Capability::Unavailable { .. }
        ));

        enabled.store(true, Ordering::Relaxed);
        assert!(matches!(
            adapter.is_available().await,
            Capability::Available
        ));
    }
}

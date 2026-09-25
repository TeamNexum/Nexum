use async_trait::async_trait;
use brightness::Brightness;
use futures::TryStreamExt;

use nexum_core::{ActionOutcome, Adapter, AdapterError, Capability};
use nexum_schema::action_types::{ids, SetBrightnessParams};
use nexum_schema::ActionStep;

use crate::util::{deser, ok};

/// Set brightness on every display exposed by the operating system.
pub struct DisplayAdapter;

impl DisplayAdapter {
    /// Enumerate and read brightness; never write during a connection check.
    pub async fn probe() -> Result<usize, AdapterError> {
        let count = brightness::brightness_devices()
            .try_fold(0usize, |count, device| async move {
                let _ = device.get().await?;
                Ok(count + 1)
            })
            .await
            .map_err(|e| AdapterError::Unavailable(format!("Lecture des écrans impossible : {e}")))?;
        if count == 0 {
            return Err(AdapterError::Unavailable("Aucun écran à luminosité contrôlable détecté".into()));
        }
        Ok(count)
    }

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
    fn supported_actions(&self) -> Vec<String> {
        vec![ids::DISPLAY_SET_BRIGHTNESS.into()]
    }

    async fn is_available(&self) -> Capability {
        if cfg!(any(target_os = "windows", target_os = "linux")) {
            Capability::Available
        } else {
            Capability::Unavailable {
                reason: "brightness control unsupported on this OS".into(),
            }
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

    async fn execute(&self, step: &ActionStep) -> Result<ActionOutcome, AdapterError> {
        self.validate(step)?;
        let p: SetBrightnessParams = deser(step)?;
        let count = brightness::brightness_devices()
            .try_fold(0usize, |count, mut device| async move {
                device.set(p.percent).await?;
                Ok(count + 1)
            })
            .await
            .map_err(|e| AdapterError::Execution(format!("brightness control failed: {e}")))?;
        if count == 0 {
            return Err(AdapterError::Unavailable(
                "no controllable displays found".into(),
            ));
        }
        Ok(ok(
            step,
            format!("brightness set to {}% on {count} display(s)", p.percent),
        ))
    }
}

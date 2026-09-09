//! Real Philips Hue integration over the local bridge HTTP API (v1).
//!
//! Enabled with the `hue` feature. Configuration via environment:
//!   - `NEXUM_HUE_BRIDGE` — bridge IP (e.g. `192.168.1.42`)
//!   - `NEXUM_HUE_USER`   — the API username (created by pressing the bridge
//!     link button; see https://developers.meethue.com/develop/get-started-2/)
//!
//! The `iot.hue.activate_scene` param `scene` is treated as the scene id.

use async_trait::async_trait;

use nexum_core::{ActionOutcome, Adapter, AdapterError, Capability, ExecContext};
use nexum_schema::action_types::{ids, HueActivateSceneParams};
use nexum_schema::ActionStep;

use crate::util::{deser, ok};

pub struct HueAdapter;

impl HueAdapter {
    pub fn new() -> Self {
        Self
    }

    fn config() -> Result<(String, String), AdapterError> {
        let bridge = std::env::var("NEXUM_HUE_BRIDGE")
            .map_err(|_| AdapterError::Unavailable("NEXUM_HUE_BRIDGE not set".into()))?;
        let user = std::env::var("NEXUM_HUE_USER")
            .map_err(|_| AdapterError::Unavailable("NEXUM_HUE_USER not set".into()))?;
        Ok((bridge, user))
    }
}

impl Default for HueAdapter {
    fn default() -> Self {
        Self::new()
    }
}

#[async_trait]
impl Adapter for HueAdapter {
    fn name(&self) -> &str {
        "hue"
    }

    fn supported_actions(&self) -> Vec<String> {
        vec![ids::IOT_HUE_ACTIVATE_SCENE.into()]
    }

    async fn is_available(&self) -> Capability {
        match Self::config() {
            Ok(_) => Capability::Available,
            Err(e) => Capability::Unavailable { reason: e.to_string() },
        }
    }

    fn validate(&self, step: &ActionStep) -> Result<(), AdapterError> {
        deser::<HueActivateSceneParams>(step).map(|_| ())
    }

    async fn execute(
        &self,
        step: &ActionStep,
        ctx: &ExecContext,
    ) -> Result<ActionOutcome, AdapterError> {
        let params: HueActivateSceneParams = deser(step)?;
        let (bridge, user) = Self::config()?;
        let url = format!("http://{bridge}/api/{user}/groups/0/action");

        if ctx.dry_run {
            return Ok(ok(step, format!("dry-run: would recall scene '{}'", params.scene)));
        }

        let body = serde_json::json!({ "scene": params.scene });
        let resp = reqwest::Client::new()
            .put(&url)
            .json(&body)
            .send()
            .await
            .map_err(|e| AdapterError::Execution(e.to_string()))?;

        if resp.status().is_success() {
            Ok(ok(step, format!("Hue scene '{}' activated", params.scene)))
        } else {
            Err(AdapterError::Execution(format!(
                "Hue bridge returned {}",
                resp.status()
            )))
        }
    }
}

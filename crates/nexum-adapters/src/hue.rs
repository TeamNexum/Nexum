//! Real Philips Hue integration over the local bridge HTTP API (v1).
//!
//! Enabled with the `hue` feature. The bridge address and API username come
//! from a [`SharedHueConfig`] filled in by the app once the bridge is paired
//! (the username is created by pressing the bridge link button; see
//! https://developers.meethue.com/develop/get-started-2/). When nothing is
//! paired, developers can still use the environment:
//!   - `NEXUM_HUE_BRIDGE` — bridge IP (e.g. `192.168.1.42`)
//!   - `NEXUM_HUE_USER`   — the API username
//!
//! The `iot.hue.activate_scene` param `scene` is a user-visible scene name.

use async_trait::async_trait;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::{Arc, RwLock};

use nexum_core::{ActionOutcome, Adapter, AdapterError, Capability};
use nexum_schema::action_types::{ids, HueActivateSceneParams};
use nexum_schema::ActionStep;

use crate::util::{deser, ok};

/// Bridge address plus the API username obtained by pressing its link button.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct HueConfig {
    pub bridge: String,
    pub user: String,
}

/// Config shared between the adapter and whatever pairs the bridge (the desktop
/// app). Updating it takes effect on the next action, without a restart.
pub type SharedHueConfig = Arc<RwLock<Option<HueConfig>>>;

pub struct HueAdapter {
    config: SharedHueConfig,
}

#[derive(Deserialize)]
struct HueScene {
    name: String,
    #[serde(default)]
    group: Option<String>,
}

fn resolve_scene(
    scenes: HashMap<String, HueScene>,
    name: &str,
) -> Result<(String, String), AdapterError> {
    let mut matches: Vec<_> = scenes
        .into_iter()
        .filter(|(_, scene)| scene.name.eq_ignore_ascii_case(name.trim()))
        .collect();
    matches.sort_by(|a, b| a.0.cmp(&b.0));
    match matches.len() {
        0 => Err(AdapterError::Execution(format!(
            "Hue scene '{name}' not found"
        ))),
        1 => {
            let (id, scene) = matches.remove(0);
            Ok((id, scene.group.unwrap_or_else(|| "0".into())))
        }
        _ => Err(AdapterError::Execution(format!(
            "Hue scene '{name}' is ambiguous; rename duplicate scenes"
        ))),
    }
}

fn bridge_result(value: serde_json::Value) -> Result<(), AdapterError> {
    let entries = value
        .as_array()
        .ok_or_else(|| AdapterError::Execution("unexpected Hue bridge response".into()))?;
    if entries.is_empty() {
        return Err(AdapterError::Execution("empty Hue bridge response".into()));
    }
    for entry in entries {
        if let Some(error) = entry.get("error") {
            return Err(AdapterError::Execution(format!(
                "Hue bridge: {}",
                error
                    .get("description")
                    .and_then(|v| v.as_str())
                    .unwrap_or("unknown error")
            )));
        }
        if entry.get("success").is_none() {
            return Err(AdapterError::Execution(
                "unexpected Hue bridge response".into(),
            ));
        }
    }
    Ok(())
}

impl HueAdapter {
    /// Authenticated read-only request; deliberately omit URLs/tokens from errors.
    pub async fn probe(&self) -> Result<(), AdapterError> {
        let HueConfig { bridge, user } = self.config()?;
        let response = reqwest::Client::new()
            .get(format!("http://{bridge}/api/{user}/config"))
            .timeout(std::time::Duration::from_secs(5))
            .send()
            .await
            .map_err(|_| AdapterError::Unavailable("Pont Hue injoignable".into()))?
            .error_for_status()
            .map_err(|_| AdapterError::Unavailable("Le pont Hue a refusé la requête".into()))?;
        let value: serde_json::Value = response
            .json()
            .await
            .map_err(|_| AdapterError::Unavailable("Réponse Hue invalide".into()))?;
        if value.get("bridgeid").is_none() {
            return Err(AdapterError::Unavailable(
                "Accès Hue non autorisé ou réponse inattendue".into(),
            ));
        }
        Ok(())
    }

    pub fn new() -> Self {
        Self::with_config(SharedHueConfig::default())
    }

    pub fn with_config(config: SharedHueConfig) -> Self {
        Self { config }
    }

    /// The paired bridge if there is one, else the `NEXUM_HUE_*` env vars
    /// (kept as a developer fallback).
    fn config(&self) -> Result<HueConfig, AdapterError> {
        if let Some(config) = self.config.read().unwrap().clone() {
            return Ok(config);
        }
        let bridge = std::env::var("NEXUM_HUE_BRIDGE")
            .map_err(|_| AdapterError::Unavailable("Hue bridge not paired".into()))?;
        let user = std::env::var("NEXUM_HUE_USER")
            .map_err(|_| AdapterError::Unavailable("Hue bridge not paired".into()))?;
        Ok(HueConfig { bridge, user })
    }
}

impl Default for HueAdapter {
    fn default() -> Self {
        Self::new()
    }
}

#[async_trait]
impl Adapter for HueAdapter {
    fn supported_actions(&self) -> Vec<String> {
        vec![ids::IOT_HUE_ACTIVATE_SCENE.into()]
    }

    async fn is_available(&self) -> Capability {
        match self.config() {
            Ok(_) => Capability::Available,
            Err(e) => Capability::Unavailable {
                reason: e.to_string(),
            },
        }
    }

    fn validate(&self, step: &ActionStep) -> Result<(), AdapterError> {
        let params: HueActivateSceneParams = deser(step)?;
        if params.scene.trim().is_empty() {
            return Err(AdapterError::InvalidParams {
                action_type: step.action_type.clone(),
                reason: "scene name cannot be empty".into(),
            });
        }
        Ok(())
    }

    async fn execute(&self, step: &ActionStep) -> Result<ActionOutcome, AdapterError> {
        self.validate(step)?;
        let params: HueActivateSceneParams = deser(step)?;

        let HueConfig { bridge, user } = self.config()?;
        let client = reqwest::Client::new();
        let list_url = format!("http://{bridge}/api/{user}/scenes");
        let list = client
            .get(&list_url)
            .send()
            .await
            .map_err(|e| AdapterError::Execution(e.to_string()))?
            .error_for_status()
            .map_err(|e| AdapterError::Execution(e.to_string()))?
            .json::<serde_json::Value>()
            .await
            .map_err(|e| AdapterError::Execution(e.to_string()))?;
        if list.is_array() {
            bridge_result(list)?;
            return Err(AdapterError::Execution(
                "Hue bridge did not return a scene list".into(),
            ));
        }
        let scenes: HashMap<String, HueScene> = serde_json::from_value(list)
            .map_err(|e| AdapterError::Execution(format!("invalid Hue scene list: {e}")))?;
        let (scene_id, group) = resolve_scene(scenes, &params.scene)?;
        let url = format!("http://{bridge}/api/{user}/groups/{group}/action");
        let body = serde_json::json!({ "scene": scene_id });
        let resp = client
            .put(&url)
            .json(&body)
            .send()
            .await
            .map_err(|e| AdapterError::Execution(e.to_string()))?;

        let value = resp
            .error_for_status()
            .map_err(|e| AdapterError::Execution(e.to_string()))?
            .json::<serde_json::Value>()
            .await
            .map_err(|e| AdapterError::Execution(e.to_string()))?;
        bridge_result(value)?;
        Ok(ok(step, format!("Hue scene '{}' activated", params.scene)))
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;

    #[test]
    fn resolves_scene_name_and_group() {
        let scenes = serde_json::from_value(json!({
            "abc": { "name": "Purple Night", "group": "2" },
            "def": { "name": "Focus", "group": "3" }
        }))
        .unwrap();
        assert_eq!(
            resolve_scene(scenes, "purple night").unwrap(),
            ("abc".into(), "2".into())
        );
    }

    #[test]
    fn paired_config_takes_effect_without_rebuilding_the_adapter() {
        let shared = SharedHueConfig::default();
        let adapter = HueAdapter::with_config(shared.clone());
        let paired = HueConfig {
            bridge: "192.168.1.42".into(),
            user: "nexum-user".into(),
        };
        *shared.write().unwrap() = Some(paired.clone());
        assert_eq!(adapter.config().unwrap(), paired);
    }

    #[test]
    fn rejects_duplicate_names_and_bridge_errors() {
        let scenes = serde_json::from_value(json!({
            "a": { "name": "Chill" }, "b": { "name": "Chill" }
        }))
        .unwrap();
        assert!(resolve_scene(scenes, "Chill").is_err());
        assert!(bridge_result(json!([{"error": {"description": "scene unavailable"}}])).is_err());
    }
}

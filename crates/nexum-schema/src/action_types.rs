//! Canonical `action_type` identifiers and their typed parameter structs.
//!
//! The wire format keeps `params` as free-form JSON (see [`crate::ActionStep`]);
//! adapters deserialize into these structs to get type safety at execution time.

use serde::{Deserialize, Serialize};

/// String constants for every built-in action type. Adapters register against
/// these, and the Marketplace validates shared modes against this allowlist.
pub mod ids {
    pub const SYSTEM_LAUNCH_APP: &str = "system.launch_app";
    pub const SYSTEM_CLOSE_APP: &str = "system.close_app";
    pub const SYSTEM_OPEN_URL: &str = "system.open_url";

    pub const AUDIO_SET_VOLUME: &str = "audio.set_volume";

    pub const DISPLAY_SET_BRIGHTNESS: &str = "display.set_brightness";

    pub const GAMING_LAUNCH_STEAM: &str = "gaming.launch_steam";
    pub const GAMING_LAUNCH_EPIC: &str = "gaming.launch_epic";
    pub const GAMING_LAUNCH_GOG: &str = "gaming.launch_gog";

    pub const IOT_HUE_ACTIVATE_SCENE: &str = "iot.hue.activate_scene";
    pub const PERIPHERAL_APPLY_RGB_PROFILE: &str = "peripheral.apply_rgb_profile";
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LaunchAppParams {
    pub path: String,
    #[serde(default)]
    pub args: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CloseAppParams {
    pub name: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OpenUrlParams {
    pub url: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SetVolumeParams {
    /// 0..=100
    pub percent: u8,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SetBrightnessParams {
    /// 0..=100
    pub percent: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LaunchSteamParams {
    pub app_id: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LaunchEpicParams {
    /// Epic app name (the segment used in `com.epicgames.launcher://apps/<name>`).
    pub name: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LaunchGogParams {
    /// GOG Galaxy game id.
    pub game_id: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HueActivateSceneParams {
    pub scene: String,
}

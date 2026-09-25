//! Per-machine integration settings, persisted as `integrations.json` in the
//! app-data dir next to `nexum.db`: which integrations the user turned on, the
//! paired Hue bridge, and whether onboarding already ran.
//!
//! [`Integrations`] also owns the live handles the adapters read (one on/off
//! switch per integration + the shared Hue config), so saving new settings
//! takes effect on the next activation without rebuilding the engine.

use std::collections::BTreeMap;
use std::path::{Path, PathBuf};
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::{Arc, Mutex};

use nexum_adapters::{HueConfig, SharedHueConfig};
use serde::{Deserialize, Serialize};

/// Every integration the user can turn on or off.
pub const INTEGRATION_IDS: [&str; 5] = ["system", "audio", "display", "gaming", "hue"];

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(default)]
pub struct IntegrationSettings {
    pub onboarding_done: bool,
    pub hue: Option<HueConfig>,
    /// Missing ids count as enabled, so a new integration is on by default.
    pub enabled: BTreeMap<String, bool>,
}

impl Default for IntegrationSettings {
    fn default() -> Self {
        Self {
            onboarding_done: false,
            hue: None,
            enabled: INTEGRATION_IDS
                .iter()
                .map(|id| (id.to_string(), true))
                .collect(),
        }
    }
}

impl IntegrationSettings {
    pub fn is_enabled(&self, id: &str) -> bool {
        self.enabled.get(id).copied().unwrap_or(true)
    }

    /// A missing or unreadable file falls back to the defaults: settings are a
    /// convenience and must never stop the app from starting.
    fn load(path: &Path) -> Self {
        match std::fs::read_to_string(path) {
            Ok(text) => serde_json::from_str(&text).unwrap_or_else(|e| {
                eprintln!("ignoring invalid {}: {e}", path.display());
                Self::default()
            }),
            Err(_) => Self::default(),
        }
    }

    /// Write to a temp file then rename, so a crash never leaves half a file.
    fn save(&self, path: &Path) -> std::io::Result<()> {
        let json = serde_json::to_string_pretty(self).map_err(std::io::Error::other)?;
        let tmp = path.with_extension("json.tmp");
        std::fs::write(&tmp, json)?;
        std::fs::rename(tmp, path)
    }
}

pub struct Integrations {
    path: PathBuf,
    settings: Mutex<IntegrationSettings>,
    hue: SharedHueConfig,
    switches: BTreeMap<&'static str, Arc<AtomicBool>>,
}

impl Integrations {
    pub fn load(path: PathBuf) -> Self {
        let settings = IntegrationSettings::load(&path);
        let integrations = Self {
            path,
            settings: Mutex::new(settings.clone()),
            hue: SharedHueConfig::default(),
            switches: INTEGRATION_IDS
                .iter()
                .map(|id| (*id, Arc::new(AtomicBool::new(true))))
                .collect(),
        };
        integrations.apply(&settings);
        integrations
    }

    /// The on/off flag an integration's `Switchable` adapter reads.
    pub fn switch(&self, id: &str) -> Arc<AtomicBool> {
        self.switches[id].clone()
    }

    pub fn hue(&self) -> SharedHueConfig {
        self.hue.clone()
    }

    pub fn get(&self) -> IntegrationSettings {
        self.settings.lock().unwrap().clone()
    }

    /// Persist first, then apply: if the write fails nothing changes.
    pub fn update(&self, settings: IntegrationSettings) -> std::io::Result<()> {
        settings.save(&self.path)?;
        self.apply(&settings);
        *self.settings.lock().unwrap() = settings;
        Ok(())
    }

    fn apply(&self, settings: &IntegrationSettings) {
        for (id, switch) in &self.switches {
            switch.store(settings.is_enabled(id), Ordering::Relaxed);
        }
        *self.hue.write().unwrap() = settings.hue.clone();
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn temp_path() -> PathBuf {
        std::env::temp_dir().join(format!("nexum-integrations-{}.json", uuid::Uuid::new_v4()))
    }

    #[test]
    fn missing_file_enables_everything() {
        let integrations = Integrations::load(temp_path());
        assert!(!integrations.get().onboarding_done);
        for id in INTEGRATION_IDS {
            assert!(integrations.switch(id).load(Ordering::Relaxed));
        }
        assert!(integrations.hue().read().unwrap().is_none());
    }

    #[test]
    fn saved_settings_apply_live_and_survive_reloading() {
        let path = temp_path();
        let integrations = Integrations::load(path.clone());
        let audio = integrations.switch("audio");
        let mut settings = integrations.get();
        settings.onboarding_done = true;
        settings.enabled.insert("audio".into(), false);
        settings.hue = Some(HueConfig {
            bridge: "192.168.1.42".into(),
            user: "nexum-user".into(),
        });
        integrations.update(settings.clone()).unwrap();

        assert!(!audio.load(Ordering::Relaxed));
        assert_eq!(*integrations.hue().read().unwrap(), settings.hue);
        assert_eq!(Integrations::load(path.clone()).get(), settings);
        std::fs::remove_file(path).unwrap();
    }

    #[test]
    fn corrupt_file_falls_back_to_defaults() {
        let path = temp_path();
        std::fs::write(&path, "{ not json").unwrap();
        assert_eq!(
            Integrations::load(path.clone()).get(),
            IntegrationSettings::default()
        );
        std::fs::remove_file(path).unwrap();
    }
}

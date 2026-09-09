//! Declarative automation: "WHEN <trigger> [IF <conditions>] THEN activate <mode>".
//!
//! Like modes, rules are pure data. The matching logic lives in `nexum-core`
//! (`automation::evaluate`), keeping this crate free of behavior.

use serde::{Deserialize, Serialize};
use uuid::Uuid;

fn default_true() -> bool {
    true
}

/// A single automation rule.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[cfg_attr(feature = "ts", derive(ts_rs::TS))]
#[cfg_attr(feature = "ts", ts(export, export_to = "../../packages/schema-ts/src/generated/"))]
pub struct AutomationRule {
    #[cfg_attr(feature = "ts", ts(type = "string"))]
    pub id: Uuid,
    pub name: String,
    #[serde(default = "default_true")]
    pub enabled: bool,
    /// The mode activated when this rule fires.
    #[cfg_attr(feature = "ts", ts(type = "string"))]
    pub target_mode_id: Uuid,
    pub trigger: Trigger,
    #[serde(default)]
    pub conditions: Vec<Condition>,
}

/// What can start a rule.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[cfg_attr(feature = "ts", derive(ts_rs::TS))]
#[cfg_attr(feature = "ts", ts(export, export_to = "../../packages/schema-ts/src/generated/"))]
#[serde(tag = "kind", rename_all = "snake_case")]
pub enum Trigger {
    /// Local time reaches HH:MM (24h clock).
    TimeOfDay { hour: u8, minute: u8 },
    /// A process/app was launched.
    AppLaunched { name: String },
    /// Battery dropped below `percent`.
    BatteryBelow { percent: u8 },
    /// The mobile app reported arriving at a named place (geolocation).
    LocationEntered { place: String },
}

/// Extra guards that must all hold for a rule to fire.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[cfg_attr(feature = "ts", derive(ts_rs::TS))]
#[cfg_attr(feature = "ts", ts(export, export_to = "../../packages/schema-ts/src/generated/"))]
#[serde(tag = "kind", rename_all = "snake_case")]
pub enum Condition {
    /// Only on these weekdays (0 = Monday .. 6 = Sunday).
    DayOfWeek { days: Vec<u8> },
    /// Only within a [from, to] window (minutes since midnight).
    TimeRange { from_min: u32, to_min: u32 },
    /// Only if a given mode is currently active.
    ModeActive {
        #[cfg_attr(feature = "ts", ts(type = "string"))]
        mode_id: Uuid,
    },
}

/// Events the outside world feeds into the automation engine.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[cfg_attr(feature = "ts", derive(ts_rs::TS))]
#[cfg_attr(feature = "ts", ts(export, export_to = "../../packages/schema-ts/src/generated/"))]
#[serde(tag = "kind", rename_all = "snake_case")]
pub enum SystemEvent {
    /// Periodic clock tick (the scheduler emits one per minute).
    Tick { hour: u8, minute: u8, weekday: u8 },
    AppLaunched { name: String },
    Battery { percent: u8 },
    LocationEntered { place: String },
}

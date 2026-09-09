//! # nexum-schema
//!
//! The **single source of truth** for Nexum's data model: the declarative
//! Mode/Action DSL that every other component consumes.
//!
//! A [`Mode`] is an ordered list of [`ActionStep`]s. Each step names a
//! namespaced `action_type` (e.g. `"audio.set_volume"`) and carries opaque
//! JSON `params` that the owning adapter interprets. Because a mode is *data,
//! never code*, the same definition can be:
//!   - edited by the no-code UI,
//!   - shared safely on the Marketplace (validated against an allowlist),
//!   - produced by the AI "Mode-as-Code" pipeline,
//!   - executed identically on any OS.
//!
//! TypeScript bindings are generated from these very types by `ts-rs` (behind
//! the `ts` feature) into `packages/schema-ts/src/generated/`. Regenerate with
//! `cargo test -p nexum-schema --features ts` — never hand-edit the output.

pub mod action_types;
pub mod automation;

use serde::{Deserialize, Serialize};
use uuid::Uuid;

/// A Mode reshapes the user's whole setup when activated.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[cfg_attr(feature = "ts", derive(ts_rs::TS))]
#[cfg_attr(feature = "ts", ts(export, export_to = "../../packages/schema-ts/src/generated/"))]
pub struct Mode {
    #[cfg_attr(feature = "ts", ts(type = "string"))]
    pub id: Uuid,
    pub name: String,
    #[serde(default)]
    pub description: Option<String>,
    pub category: Category,
    pub steps: Vec<ActionStep>,
}

impl Mode {
    /// Borrow the steps sorted by their `order` field (does not mutate).
    pub fn ordered_steps(&self) -> Vec<&ActionStep> {
        let mut steps: Vec<&ActionStep> = self.steps.iter().collect();
        steps.sort_by_key(|s| s.order);
        steps
    }
}

/// High-level grouping used for UI and defaults. Purely descriptive.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[cfg_attr(feature = "ts", derive(ts_rs::TS))]
#[cfg_attr(feature = "ts", ts(export, export_to = "../../packages/schema-ts/src/generated/"))]
#[serde(rename_all = "snake_case")]
pub enum Category {
    Gaming,
    Work,
    Chill,
    Streaming,
    Night,
    Custom,
}

/// One declarative action inside a mode.
///
/// The wire format stays intentionally flexible: `action_type` is a string and
/// `params` is arbitrary JSON. Adapters deserialize `params` into the typed
/// structs in [`action_types`]. This keeps the model open for a future plugin
/// SDK without touching the engine.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[cfg_attr(feature = "ts", derive(ts_rs::TS))]
#[cfg_attr(feature = "ts", ts(export, export_to = "../../packages/schema-ts/src/generated/"))]
pub struct ActionStep {
    pub order: u32,
    /// Namespaced identifier, e.g. `"audio.set_volume"`.
    #[serde(rename = "type")]
    pub action_type: String,
    #[serde(default)]
    #[cfg_attr(feature = "ts", ts(type = "Record<string, unknown>"))]
    pub params: serde_json::Value,
    #[serde(default = "default_true")]
    pub enabled: bool,
    #[serde(default)]
    pub on_error: OnError,
}

fn default_true() -> bool {
    true
}

/// How the engine reacts when a step fails.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Default, Serialize, Deserialize)]
#[cfg_attr(feature = "ts", derive(ts_rs::TS))]
#[cfg_attr(feature = "ts", ts(export, export_to = "../../packages/schema-ts/src/generated/"))]
#[serde(rename_all = "snake_case")]
pub enum OnError {
    /// Log the failure, skip the step, keep going (default — resilient).
    #[default]
    Continue,
    /// Stop executing the rest of the mode.
    Abort,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn ordered_steps_sorts_by_order() {
        let mode = Mode {
            id: Uuid::nil(),
            name: "t".into(),
            description: None,
            category: Category::Custom,
            steps: vec![
                ActionStep { order: 3, action_type: "a".into(), params: serde_json::Value::Null, enabled: true, on_error: OnError::Continue },
                ActionStep { order: 1, action_type: "b".into(), params: serde_json::Value::Null, enabled: true, on_error: OnError::Continue },
            ],
        };
        let ordered: Vec<u32> = mode.ordered_steps().iter().map(|s| s.order).collect();
        assert_eq!(ordered, vec![1, 3]);
    }

    #[test]
    fn deserializes_from_dsl_json() {
        let json = r#"{
            "id": "00000000-0000-0000-0000-000000000000",
            "name": "Ranked",
            "category": "gaming",
            "steps": [
                { "order": 1, "type": "audio.set_volume", "params": { "percent": 70 } }
            ]
        }"#;
        let mode: Mode = serde_json::from_str(json).unwrap();
        assert_eq!(mode.name, "Ranked");
        assert_eq!(mode.steps.len(), 1);
        // defaults applied
        assert!(mode.steps[0].enabled);
        assert_eq!(mode.steps[0].on_error, OnError::Continue);
    }
}

//! Marketplace safety: static analysis + risk scoring for shared modes.
//!
//! Because a shared mode is *declarative data* (a list of known `action_type`s,
//! never code), "sandboxing" reduces to: reject anything outside the allowlist,
//! and score the remaining actions by impact. No untrusted code ever runs.

use serde::Serialize;

use nexum_schema::Mode;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
#[cfg_attr(feature = "ts", derive(ts_rs::TS))]
#[cfg_attr(feature = "ts", ts(export, export_to = "../../packages/schema-ts/src/generated/"))]
#[serde(rename_all = "snake_case")]
pub enum RiskLevel {
    Low,
    Medium,
    High,
    /// Contains an action outside the allowlist — must not be published.
    Rejected,
}

#[derive(Debug, Clone, Serialize)]
#[cfg_attr(feature = "ts", derive(ts_rs::TS))]
#[cfg_attr(feature = "ts", ts(export, export_to = "../../packages/schema-ts/src/generated/"))]
pub struct RiskReport {
    pub score: u32,
    pub level: RiskLevel,
    pub issues: Vec<String>,
    pub unknown_actions: Vec<String>,
}

/// Assess a shared mode against the allowlist of known action_types
/// (typically [`crate::ActionRegistry::known_action_types`]).
pub fn assess(mode: &Mode, allowlist: &[String]) -> RiskReport {
    let mut score = 0u32;
    let mut issues = Vec::new();
    let mut unknown = Vec::new();

    for step in &mode.steps {
        if !allowlist.contains(&step.action_type) {
            unknown.push(step.action_type.clone());
            continue;
        }
        let weight = action_risk_weight(&step.action_type);
        score += weight;
        if weight >= 30 {
            issues.push(format!("high-impact action: {}", step.action_type));
        }
    }

    let level = if !unknown.is_empty() {
        RiskLevel::Rejected
    } else if score >= 80 {
        RiskLevel::High
    } else if score >= 40 {
        RiskLevel::Medium
    } else {
        RiskLevel::Low
    };

    RiskReport { score, level, issues, unknown_actions: unknown }
}

/// Per-action impact weight. Higher = more capable of harm/annoyance.
fn action_risk_weight(action_type: &str) -> u32 {
    match action_type {
        "system.close_app" => 30,  // can kill the user's processes
        "system.launch_app" => 25, // runs a local binary by path
        "system.open_url" => 10,
        "gaming.launch_steam" => 5,
        "audio.set_volume" => 2,
        "display.set_brightness" => 2,
        "iot.hue.activate_scene" => 2,
        "peripheral.apply_rgb_profile" => 2,
        _ => 15, // known but unclassified
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use nexum_schema::{ActionStep, Category, Mode, OnError};
    use uuid::Uuid;

    fn mode_with(actions: &[&str]) -> Mode {
        Mode {
            id: Uuid::nil(),
            name: "shared".into(),
            description: None,
            category: Category::Custom,
            steps: actions
                .iter()
                .enumerate()
                .map(|(i, a)| ActionStep {
                    order: i as u32,
                    action_type: (*a).into(),
                    params: serde_json::Value::Null,
                    enabled: true,
                    on_error: OnError::Continue,
                })
                .collect(),
        }
    }

    fn allowlist() -> Vec<String> {
        ["audio.set_volume", "system.close_app", "system.launch_app", "iot.hue.activate_scene"]
            .iter()
            .map(|s| s.to_string())
            .collect()
    }

    #[test]
    fn safe_mode_is_low_risk() {
        let report = assess(&mode_with(&["audio.set_volume", "iot.hue.activate_scene"]), &allowlist());
        assert_eq!(report.level, RiskLevel::Low);
        assert!(report.unknown_actions.is_empty());
    }

    #[test]
    fn unknown_action_is_rejected() {
        let report = assess(&mode_with(&["audio.set_volume", "evil.rm_rf"]), &allowlist());
        assert_eq!(report.level, RiskLevel::Rejected);
        assert_eq!(report.unknown_actions, vec!["evil.rm_rf".to_string()]);
    }

    #[test]
    fn many_high_impact_actions_raise_the_level() {
        let report = assess(
            &mode_with(&["system.close_app", "system.launch_app", "system.close_app"]),
            &allowlist(),
        );
        // 30 + 25 + 30 = 85 -> High
        assert_eq!(report.score, 85);
        assert_eq!(report.level, RiskLevel::High);
        assert!(!report.issues.is_empty());
    }
}

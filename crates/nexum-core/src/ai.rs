//! "Mode-as-Code": turn a natural-language request into a validated Mode (DSL).
//!
//! This is a **heuristic stand-in** for the production pipeline. In production,
//! the keyword matching below is replaced by a Claude API call whose system
//! prompt asks for exactly this `Mode` JSON (constrained to known action_types),
//! followed by a `dry_run` simulation and capability check. Crucially, the
//! *output type is the contract* — swapping the heuristic for the LLM changes
//! nothing downstream. The LLM never emits code, only declarative data.

use serde_json::json;
use uuid::Uuid;

use nexum_schema::action_types::ids;
use nexum_schema::{ActionStep, Category, Mode, OnError};

fn step(order: u32, action_type: &str, params: serde_json::Value) -> ActionStep {
    ActionStep {
        order,
        action_type: action_type.into(),
        params,
        enabled: true,
        on_error: OnError::Continue,
    }
}

fn matches_any(haystack: &str, needles: &[&str]) -> bool {
    needles.iter().any(|n| haystack.contains(n))
}

fn detect_category(p: &str) -> Category {
    if matches_any(p, &["stream", "obs", "twitch", "direct"]) {
        Category::Streaming
    } else if matches_any(p, &["game", "gaming", "jeu", "ranked", "fps"]) {
        Category::Gaming
    } else if matches_any(p, &["work", "travail", "code", "focus", "dev"]) {
        Category::Work
    } else if matches_any(p, &["chill", "relax", "détente", "detente", "music", "musique"]) {
        Category::Chill
    } else if matches_any(p, &["night", "nuit", "sleep", "dodo"]) {
        Category::Night
    } else {
        Category::Custom
    }
}

fn suggest_name(category: Category) -> String {
    match category {
        Category::Gaming => "Gaming (AI)",
        Category::Work => "Work (AI)",
        Category::Chill => "Chill (AI)",
        Category::Streaming => "Streaming (AI)",
        Category::Night => "Night (AI)",
        Category::Custom => "Custom (AI)",
    }
    .to_string()
}

/// Generate a Mode from a natural-language prompt.
pub fn generate_mode(prompt: &str, id: Uuid) -> Mode {
    let p = prompt.to_lowercase();
    let category = detect_category(&p);

    let volume = if matches_any(&p, &["game", "gaming", "jeu", "stream", "fps"]) {
        70
    } else if matches_any(&p, &["work", "travail", "code", "focus"]) {
        20
    } else if matches_any(&p, &["night", "nuit", "sleep"]) {
        10
    } else {
        40
    };

    let mut steps = vec![step(1, ids::AUDIO_SET_VOLUME, json!({ "percent": volume }))];

    match category {
        Category::Gaming => {
            steps.push(step(2, ids::DISPLAY_SET_BRIGHTNESS, json!({ "percent": 100 })));
            steps.push(step(3, ids::IOT_HUE_ACTIVATE_SCENE, json!({ "scene": "Gaming" })));
        }
        Category::Work => {
            steps.push(step(2, ids::DISPLAY_SET_BRIGHTNESS, json!({ "percent": 70 })));
            steps.push(step(3, ids::SYSTEM_OPEN_URL, json!({ "url": "https://docs.google.com" })));
        }
        Category::Chill => {
            steps.push(step(2, ids::IOT_HUE_ACTIVATE_SCENE, json!({ "scene": "Sunset Glow" })));
            steps.push(step(3, ids::SYSTEM_OPEN_URL, json!({ "url": "https://open.spotify.com" })));
        }
        Category::Streaming => {
            steps.push(step(2, ids::SYSTEM_LAUNCH_APP, json!({ "path": "obs64" })));
            steps.push(step(3, ids::IOT_HUE_ACTIVATE_SCENE, json!({ "scene": "Studio" })));
        }
        Category::Night => {
            steps.push(step(2, ids::DISPLAY_SET_BRIGHTNESS, json!({ "percent": 20 })));
        }
        Category::Custom => {}
    }

    if p.contains("steam") {
        let next = steps.len() as u32 + 1;
        steps.push(step(next, ids::GAMING_LAUNCH_STEAM, json!({ "app_id": "000000" })));
    }

    Mode {
        id,
        name: suggest_name(category),
        description: Some(format!("Generated from: \"{}\"", prompt.trim())),
        category,
        steps,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn gaming_prompt_builds_a_gaming_mode() {
        let mode = generate_mode("Set up my PC for a ranked gaming session on steam", Uuid::nil());
        assert_eq!(mode.category, Category::Gaming);
        // volume + brightness + hue + steam launch
        assert_eq!(mode.steps.len(), 4);
        assert!(mode.steps.iter().any(|s| s.action_type == ids::GAMING_LAUNCH_STEAM));
    }

    #[test]
    fn chill_prompt_builds_a_chill_mode() {
        let mode = generate_mode("I want to relax with some music", Uuid::nil());
        assert_eq!(mode.category, Category::Chill);
        assert_eq!(mode.steps[0].action_type, ids::AUDIO_SET_VOLUME);
    }

    #[test]
    fn unknown_prompt_is_custom_with_at_least_volume() {
        let mode = generate_mode("blah blah", Uuid::nil());
        assert_eq!(mode.category, Category::Custom);
        assert_eq!(mode.steps.len(), 1);
    }
}

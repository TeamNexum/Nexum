//! Real "Mode-as-Code" via the Claude Messages API (feature `claude`).
//!
//! Rust has no official Anthropic SDK, so this calls the HTTP API directly
//! (the documented approach). The model returns the Mode DSL as JSON, which we
//! parse into [`nexum_schema::Mode`] — the same type the heuristic produces, so
//! the rest of the system is unchanged.
//!
//! Config: set `ANTHROPIC_API_KEY` in the environment.

use nexum_schema::Mode;

const MODEL: &str = "claude-opus-4-8";
const ENDPOINT: &str = "https://api.anthropic.com/v1/messages";

fn system_prompt() -> String {
    // The allowlist keeps generated modes safe by construction.
    "You convert a natural-language request into a Nexum \"mode\", returned as a \
single JSON object and nothing else (no markdown, no prose).\n\
Shape: {\"id\":\"00000000-0000-0000-0000-000000000000\",\"name\":string,\
\"description\":string,\"category\":one of \
[\"gaming\",\"work\",\"chill\",\"streaming\",\"night\",\"custom\"],\
\"steps\":[{\"order\":int,\"type\":action_type,\"params\":object,\
\"enabled\":true,\"on_error\":\"continue\"}]}\n\
Allowed action_type values and their params:\n\
- audio.set_volume {\"percent\":0-100}\n\
- display.set_brightness {\"percent\":0-100}\n\
- system.launch_app {\"path\":string}\n\
- system.close_app {\"name\":string}\n\
- system.open_url {\"url\":string}\n\
- gaming.launch_steam {\"app_id\":string}\n\
- iot.hue.activate_scene {\"scene\":string}\n\
- peripheral.apply_rgb_profile {\"profile\":string}\n\
Use ONLY those action types. Order steps from 1."
        .to_string()
}

/// Generate a Mode from a prompt by calling Claude. Returns the parsed Mode
/// with a fresh id, or an error string (the caller falls back to the heuristic).
pub async fn generate_via_claude(prompt: &str) -> Result<Mode, String> {
    let api_key =
        std::env::var("ANTHROPIC_API_KEY").map_err(|_| "ANTHROPIC_API_KEY not set".to_string())?;

    let body = serde_json::json!({
        "model": MODEL,
        "max_tokens": 1024,
        "system": system_prompt(),
        "messages": [{ "role": "user", "content": prompt }],
    });

    let resp = reqwest::Client::new()
        .post(ENDPOINT)
        .header("x-api-key", api_key)
        .header("anthropic-version", "2023-06-01")
        .header("content-type", "application/json")
        .json(&body)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let value: serde_json::Value = resp.json().await.map_err(|e| e.to_string())?;
    let text = value["content"][0]["text"]
        .as_str()
        .ok_or_else(|| format!("unexpected response shape: {value}"))?;

    let mut mode: Mode =
        serde_json::from_str(text).map_err(|e| format!("could not parse mode json: {e}"))?;
    mode.id = uuid::Uuid::new_v4();
    Ok(mode)
}

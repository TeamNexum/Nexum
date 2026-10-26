//! Beta feedback: the tester writes a message, optionally adds a screenshot
//! and, only if they tick the box, the app's log files. The report goes to a
//! Discord webhook.
//!
//! The webhook URL is read from `NEXUM_FEEDBACK_WEBHOOK`, at runtime first (dev)
//! then at build time (CI secret), so it is never committed. It still ships
//! inside the binary, which is acceptable for a closed beta: rotate the webhook
//! if it leaks. Once nexum-cloud is deployed, this should post to the cloud
//! instead, which keeps the webhook server-side.

use std::path::Path;

use base64::Engine as _;
use reqwest::multipart::{Form, Part};
use serde::Deserialize;
use serde_json::json;
use tauri::Manager;

use crate::redact::redact;

/// Discord caps an embed description at 4096 characters.
pub const MAX_MESSAGE_CHARS: usize = 4000;
/// Discord caps a message's attachments at 10 MB without a server boost.
const MAX_SCREENSHOT_BYTES: usize = 8 * 1024 * 1024;
const MAX_LOG_BYTES: usize = 1024 * 1024;

const LOGS_FILE_NAME: &str = "nexum-logs.txt";

#[derive(Debug, Deserialize)]
pub struct Screenshot {
    pub mime: String,
    pub data_base64: String,
}

#[derive(Debug, Deserialize)]
pub struct FeedbackRequest {
    pub message: String,
    pub contact: Option<String>,
    pub screenshot: Option<Screenshot>,
    pub include_logs: bool,
}

fn webhook_url() -> Option<String> {
    std::env::var("NEXUM_FEEDBACK_WEBHOOK")
        .ok()
        .or_else(|| option_env!("NEXUM_FEEDBACK_WEBHOOK").map(str::to_string))
        .filter(|url| !url.trim().is_empty())
}

fn screenshot_extension(mime: &str) -> Option<&'static str> {
    match mime {
        "image/png" => Some("png"),
        "image/jpeg" => Some("jpg"),
        "image/webp" => Some("webp"),
        "image/gif" => Some("gif"),
        _ => None,
    }
}

/// The last `MAX_LOG_BYTES` of every `.log` file in `dir`, oldest file first,
/// redacted again in case a line was written before a secret was registered.
pub fn collect_logs(dir: &Path) -> String {
    let mut files: Vec<_> = std::fs::read_dir(dir)
        .into_iter()
        .flatten()
        .flatten()
        .filter(|entry| entry.path().extension().is_some_and(|ext| ext == "log"))
        .filter_map(|entry| Some((entry.metadata().ok()?.modified().ok()?, entry.path())))
        .collect();
    files.sort();

    let mut logs = String::new();
    for (_, path) in files {
        if let Ok(text) = std::fs::read(&path) {
            logs.push_str(&String::from_utf8_lossy(&text));
        }
    }
    if logs.len() > MAX_LOG_BYTES {
        let mut start = logs.len() - MAX_LOG_BYTES;
        while !logs.is_char_boundary(start) {
            start += 1;
        }
        logs.drain(..start);
    }
    redact(&logs)
}

/// The Discord message: the tester's text in an embed (no pings allowed),
/// plus version and OS so a report can be matched to a build.
fn payload(
    request: &FeedbackRequest,
    version: &str,
    screenshot_name: Option<&str>,
) -> serde_json::Value {
    let mut fields = vec![
        json!({ "name": "Version", "value": version, "inline": true }),
        json!({
            "name": "Système",
            "value": format!("{} ({})", std::env::consts::OS, std::env::consts::ARCH),
            "inline": true,
        }),
        json!({
            "name": "Journal joint",
            "value": if request.include_logs { "Oui" } else { "Non" },
            "inline": true,
        }),
    ];
    if let Some(contact) = request.contact.as_deref().map(str::trim).filter(|c| !c.is_empty()) {
        fields.push(json!({ "name": "Contact", "value": contact.chars().take(200).collect::<String>() }));
    }
    let mut embed = json!({
        "title": "Retour bêta-testeur",
        "description": redact(request.message.trim()),
        "color": 0x7c5cff,
        "fields": fields,
        "timestamp": chrono::Utc::now().to_rfc3339(),
    });
    if let Some(name) = screenshot_name {
        embed["image"] = json!({ "url": format!("attachment://{name}") });
    }
    json!({ "allowed_mentions": { "parse": [] }, "embeds": [embed] })
}

/// The redacted logs exactly as they would be attached, for the "see what is
/// sent" preview.
#[tauri::command]
pub fn feedback_logs(app: tauri::AppHandle) -> Result<String, String> {
    let dir = app.path().app_log_dir().map_err(|e| e.to_string())?;
    Ok(collect_logs(&dir))
}

#[tauri::command]
pub async fn send_feedback(app: tauri::AppHandle, request: FeedbackRequest) -> Result<(), String> {
    let message_len = request.message.trim().chars().count();
    if message_len == 0 {
        return Err("Décrivez votre retour avant de l'envoyer.".into());
    }
    if message_len > MAX_MESSAGE_CHARS {
        return Err(format!("Le message dépasse {MAX_MESSAGE_CHARS} caractères."));
    }
    let url = webhook_url()
        .ok_or("L'envoi des retours n'est pas configuré dans cette version de Nexum.")?;

    let mut form = Form::new();
    let mut screenshot_name = None;
    let mut index = 0;
    if let Some(screenshot) = &request.screenshot {
        let ext = screenshot_extension(&screenshot.mime)
            .ok_or("Format de capture non pris en charge (PNG, JPEG, WebP ou GIF).")?;
        let bytes = base64::engine::general_purpose::STANDARD
            .decode(&screenshot.data_base64)
            .map_err(|_| "Capture illisible.")?;
        if bytes.len() > MAX_SCREENSHOT_BYTES {
            return Err("La capture dépasse 8 Mo.".into());
        }
        let name = format!("capture.{ext}");
        let part = Part::bytes(bytes)
            .file_name(name.clone())
            .mime_str(&screenshot.mime)
            .map_err(|e| e.to_string())?;
        form = form.part(format!("files[{index}]"), part);
        screenshot_name = Some(name);
        index += 1;
    }
    if request.include_logs {
        let logs = feedback_logs(app.clone())?;
        let part = Part::bytes(logs.into_bytes())
            .file_name(LOGS_FILE_NAME)
            .mime_str("text/plain; charset=utf-8")
            .map_err(|e| e.to_string())?;
        form = form.part(format!("files[{index}]"), part);
    }
    let version = app.package_info().version.to_string();
    let body = payload(&request, &version, screenshot_name.as_deref());
    form = form.text("payload_json", body.to_string());

    // `without_url`: the webhook URL is a secret and must not reach the UI or logs.
    let response = reqwest::Client::new()
        .post(url)
        .multipart(form)
        .timeout(std::time::Duration::from_secs(30))
        .send()
        .await
        .map_err(|e| {
            log::warn!("feedback not sent: {}", e.without_url());
            "Envoi impossible : vérifiez votre connexion puis réessayez.".to_string()
        })?;
    if !response.status().is_success() {
        log::warn!("feedback rejected by the webhook: HTTP {}", response.status());
        return Err(format!("Le serveur a refusé le retour (HTTP {}).", response.status().as_u16()));
    }
    log::info!(
        "feedback sent (screenshot: {}, logs: {})",
        request.screenshot.is_some(),
        request.include_logs
    );
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    fn request(include_logs: bool, contact: Option<&str>) -> FeedbackRequest {
        FeedbackRequest {
            message: "  Le mode Gaming ne lance pas Steam  ".into(),
            contact: contact.map(str::to_string),
            screenshot: None,
            include_logs,
        }
    }

    #[test]
    fn payload_disables_mentions_and_carries_context() {
        let body = payload(&request(true, Some("  sam@exemple.com ")), "0.1.0", Some("capture.png"));
        assert_eq!(body["allowed_mentions"]["parse"], json!([]));
        let embed = &body["embeds"][0];
        assert_eq!(embed["description"], "Le mode Gaming ne lance pas Steam");
        assert_eq!(embed["image"]["url"], "attachment://capture.png");
        let fields = embed["fields"].as_array().unwrap();
        assert!(fields.iter().any(|f| f["name"] == "Version" && f["value"] == "0.1.0"));
        assert!(fields.iter().any(|f| f["name"] == "Journal joint" && f["value"] == "Oui"));
        assert!(fields.iter().any(|f| f["name"] == "Contact" && f["value"] == "sam@exemple.com"));
    }

    #[test]
    fn payload_omits_empty_contact_and_missing_screenshot() {
        let body = payload(&request(false, Some("   ")), "0.1.0", None);
        let embed = &body["embeds"][0];
        assert!(embed.get("image").is_none());
        assert!(!embed["fields"].as_array().unwrap().iter().any(|f| f["name"] == "Contact"));
    }

    #[test]
    fn collect_logs_keeps_the_tail_and_redacts() {
        let dir = std::env::temp_dir().join(format!("nexum-logs-{}", uuid::Uuid::new_v4()));
        std::fs::create_dir_all(&dir).unwrap();
        std::fs::write(dir.join("ignored.txt"), "not a log").unwrap();
        let big = "x".repeat(MAX_LOG_BYTES);
        std::fs::write(
            dir.join("nexum.log"),
            format!("{big}\nGET http://10.0.0.2/api/abcdefghijklmnopqrstuvwxyz/scenes failed\n"),
        )
        .unwrap();

        let logs = collect_logs(&dir);
        assert!(logs.len() <= MAX_LOG_BYTES);
        assert!(logs.ends_with("/api/[REDACTED]/scenes failed\n"), "{}", &logs[logs.len() - 80..]);
        assert!(!logs.contains("not a log"));
        std::fs::remove_dir_all(dir).unwrap();
    }

    #[test]
    fn collect_logs_on_missing_dir_is_empty() {
        assert_eq!(collect_logs(Path::new("/definitely/not/here")), "");
    }

    #[test]
    fn screenshot_types_are_allowlisted() {
        assert_eq!(screenshot_extension("image/png"), Some("png"));
        assert_eq!(screenshot_extension("image/svg+xml"), None);
    }
}

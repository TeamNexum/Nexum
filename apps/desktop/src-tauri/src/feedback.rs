//! Beta feedback, desktop side: what the app adds to a tester's report. The
//! form (FeedbackDialog.tsx) sends it to Nexum Cloud (`POST /api/feedback`),
//! which forwards it to the team's Discord, so no webhook ships in the app.

use std::path::Path;

use nexum_core::redact::redact;
use serde::Serialize;
use tauri::Manager;

/// The cloud also caps the logs at 1 MB.
const MAX_LOG_BYTES: usize = 1024 * 1024;

#[derive(Serialize)]
pub struct FeedbackContext {
    version: String,
    os: String,
    logs: Option<String>,
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

/// App version and OS, plus the redacted logs only when the tester agreed to
/// attach them (also used for the "see what is sent" preview).
#[tauri::command]
pub fn feedback_context(app: tauri::AppHandle, include_logs: bool) -> Result<FeedbackContext, String> {
    let logs = if include_logs {
        let dir = app.path().app_log_dir().map_err(|e| e.to_string())?;
        Some(collect_logs(&dir))
    } else {
        None
    };
    Ok(FeedbackContext {
        version: app.package_info().version.to_string(),
        os: format!("{} ({})", std::env::consts::OS, std::env::consts::ARCH),
        logs,
    })
}

#[cfg(test)]
mod tests {
    use super::*;

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
}

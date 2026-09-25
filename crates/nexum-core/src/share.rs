//! Mode sharing: export a mode to a `.nexum.json` file and import it elsewhere.
//!
//! A mode is already plain JSON (the shared [`Mode`] schema), so a shared file
//! is just that mode wrapped in a small versioned envelope. Importing runs the
//! same static analysis as the Marketplace ([`crate::marketplace::assess`]):
//! a file containing an action outside the allowlist is refused, and the risk
//! level of everything else is surfaced to the user before saving.

use serde::{Deserialize, Serialize};
use serde_json::Value;
use thiserror::Error;
use uuid::Uuid;

use nexum_schema::Mode;

use crate::marketplace::{assess, RiskLevel, RiskReport};

/// Version of the `.nexum.json` envelope written by [`export`].
pub const SHARE_FORMAT: u32 = 1;

/// Extension appended to exported files.
pub const FILE_EXTENSION: &str = ".nexum.json";

/// Upper bound on an imported file. Real modes weigh a few KiB; anything far
/// bigger is not a mode and is refused before parsing.
pub const MAX_IMPORT_BYTES: usize = 256 * 1024;

/// On-disk format of a shared mode.
#[derive(Debug, Serialize, Deserialize)]
struct SharedMode {
    nexum_format: u32,
    mode: Mode,
}

/// A parsed import, ready to be shown to the user before it is saved.
#[derive(Debug, Clone, Serialize)]
#[cfg_attr(feature = "ts", derive(ts_rs::TS))]
#[cfg_attr(
    feature = "ts",
    ts(export, export_to = "../../../packages/schema-ts/src/generated/")
)]
pub struct ImportPreview {
    /// The imported mode, already carrying a fresh id.
    pub mode: Mode,
    pub risk: RiskReport,
}

#[derive(Debug, Error, PartialEq)]
pub enum ImportError {
    #[error("fichier trop volumineux ({0} octets) pour être un mode Nexum")]
    TooLarge(usize),

    #[error("fichier invalide : {0}")]
    InvalidJson(String),

    #[error("format de fichier non pris en charge (version {0})")]
    UnsupportedFormat(u32),

    #[error("import refusé : actions inconnues ({})", .0.join(", "))]
    Rejected(Vec<String>),
}

/// Serialize a mode into the `.nexum.json` format.
pub fn export(mode: &Mode) -> String {
    let shared = SharedMode {
        nexum_format: SHARE_FORMAT,
        mode: mode.clone(),
    };
    serde_json::to_string_pretty(&shared).expect("a Mode always serializes")
}

/// Suggested file name for an exported mode, e.g. `"Soirée Chill"` ->
/// `"soiree-chill.nexum.json"`.
pub fn file_name(mode: &Mode) -> String {
    let mut slug = String::new();
    for c in mode.name.chars().flat_map(fold_accent) {
        if c.is_ascii_alphanumeric() {
            slug.push(c.to_ascii_lowercase());
        } else if !slug.is_empty() && !slug.ends_with('-') {
            slug.push('-');
        }
    }
    let slug = slug.trim_end_matches('-');
    let slug = if slug.is_empty() { "mode" } else { slug };
    format!("{slug}{FILE_EXTENSION}")
}


pub fn preview_import(
    contents: &str,
    allowlist: &[String],
    new_id: Uuid,
) -> Result<ImportPreview, ImportError> {
    if contents.len() > MAX_IMPORT_BYTES {
        return Err(ImportError::TooLarge(contents.len()));
    }
    let value: Value =
        serde_json::from_str(contents).map_err(|e| ImportError::InvalidJson(e.to_string()))?;

    let mut mode: Mode = if let Some(format) = value.get("nexum_format") {
        let format = format
            .as_u64()
            .ok_or_else(|| ImportError::InvalidJson("`nexum_format` doit être un entier".into()))?;
        if format != SHARE_FORMAT as u64 {
            return Err(ImportError::UnsupportedFormat(format as u32));
        }
        serde_json::from_value::<SharedMode>(value)
            .map_err(|e| ImportError::InvalidJson(e.to_string()))?
            .mode
    } else {
        serde_json::from_value(value).map_err(|e| ImportError::InvalidJson(e.to_string()))?
    };

    mode.id = new_id;
    let risk = assess(&mode, allowlist);
    Ok(ImportPreview { mode, risk })
}

/// Like [`preview_import`], but refuses a mode containing unknown actions.
pub fn import(
    contents: &str,
    allowlist: &[String],
    new_id: Uuid,
) -> Result<ImportPreview, ImportError> {
    let preview = preview_import(contents, allowlist, new_id)?;
    if preview.risk.level == RiskLevel::Rejected {
        return Err(ImportError::Rejected(preview.risk.unknown_actions));
    }
    Ok(preview)
}

/// Map common Latin accented letters to ASCII so file names stay portable.
fn fold_accent(c: char) -> Vec<char> {
    match c {
        'à' | 'â' | 'ä' | 'á' | 'À' | 'Â' | 'Ä' | 'Á' => vec!['a'],
        'é' | 'è' | 'ê' | 'ë' | 'É' | 'È' | 'Ê' | 'Ë' => vec!['e'],
        'î' | 'ï' | 'í' | 'Î' | 'Ï' | 'Í' => vec!['i'],
        'ô' | 'ö' | 'ó' | 'Ô' | 'Ö' | 'Ó' => vec!['o'],
        'ù' | 'û' | 'ü' | 'ú' | 'Ù' | 'Û' | 'Ü' | 'Ú' => vec!['u'],
        'ç' | 'Ç' => vec!['c'],
        'œ' | 'Œ' => vec!['o', 'e'],
        'æ' | 'Æ' => vec!['a', 'e'],
        _ => vec![c],
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use nexum_schema::{ActionStep, Category, OnError};
    use serde_json::json;

    fn mode(name: &str, actions: &[&str]) -> Mode {
        Mode {
            id: Uuid::from_u128(1),
            name: name.into(),
            description: Some("shared".into()),
            category: Category::Chill,
            steps: actions
                .iter()
                .enumerate()
                .map(|(i, a)| ActionStep {
                    order: i as u32,
                    action_type: (*a).into(),
                    params: json!({ "level": 30 }),
                    enabled: true,
                    on_error: OnError::Continue,
                })
                .collect(),
        }
    }

    fn allowlist() -> Vec<String> {
        vec!["audio.set_volume".into(), "system.close_app".into()]
    }

    #[test]
    fn export_then_import_round_trips_with_a_new_id() {
        let original = mode("Chill", &["audio.set_volume"]);
        let new_id = Uuid::from_u128(42);

        let preview = import(&export(&original), &allowlist(), new_id).unwrap();

        assert_eq!(preview.mode.id, new_id);
        assert_eq!(preview.mode.name, original.name);
        assert_eq!(preview.mode.steps, original.steps);
        assert_eq!(preview.risk.level, RiskLevel::Low);
    }

    #[test]
    fn export_is_a_versioned_envelope() {
        let value: Value = serde_json::from_str(&export(&mode("Chill", &[]))).unwrap();
        assert_eq!(value["nexum_format"], SHARE_FORMAT);
        assert_eq!(value["mode"]["name"], "Chill");
    }

    #[test]
    fn a_bare_mode_is_accepted() {
        let bare = serde_json::to_string(&mode("Bare", &["audio.set_volume"])).unwrap();
        let preview = import(&bare, &allowlist(), Uuid::from_u128(7)).unwrap();
        assert_eq!(preview.mode.name, "Bare");
        assert_eq!(preview.mode.id, Uuid::from_u128(7));
    }

    #[test]
    fn unknown_actions_are_reported_then_refused() {
        let file = export(&mode("Evil", &["audio.set_volume", "evil.rm_rf"]));

        let preview = preview_import(&file, &allowlist(), Uuid::nil()).unwrap();
        assert_eq!(preview.risk.level, RiskLevel::Rejected);

        assert_eq!(
            import(&file, &allowlist(), Uuid::nil()).unwrap_err(),
            ImportError::Rejected(vec!["evil.rm_rf".into()])
        );
    }

    #[test]
    fn high_impact_modes_are_imported_with_their_risk_level() {
        let file = export(&mode(
            "Cleanup",
            &["system.close_app", "system.close_app", "system.close_app"],
        ));
        let preview = import(&file, &allowlist(), Uuid::nil()).unwrap();
        assert_eq!(preview.risk.level, RiskLevel::High);
    }

    #[test]
    fn malformed_files_are_invalid() {
        for bad in [
            "not json",
            "{}",
            r#"{"nexum_format": 1}"#,
            r#"{"name": "x"}"#,
        ] {
            assert!(
                matches!(
                    preview_import(bad, &allowlist(), Uuid::nil()),
                    Err(ImportError::InvalidJson(_))
                ),
                "{bad} should be invalid"
            );
        }
    }

    #[test]
    fn future_formats_are_unsupported() {
        let file = json!({ "nexum_format": 99, "mode": mode("Chill", &[]) }).to_string();
        assert_eq!(
            preview_import(&file, &allowlist(), Uuid::nil()).unwrap_err(),
            ImportError::UnsupportedFormat(99)
        );
    }

    #[test]
    fn oversized_files_are_refused_before_parsing() {
        let huge = " ".repeat(MAX_IMPORT_BYTES + 1);
        assert_eq!(
            preview_import(&huge, &allowlist(), Uuid::nil()).unwrap_err(),
            ImportError::TooLarge(MAX_IMPORT_BYTES + 1)
        );
    }

    #[test]
    fn file_names_are_portable_slugs() {
        assert_eq!(
            file_name(&mode("Soirée Chill", &[])),
            "soiree-chill.nexum.json"
        );
        assert_eq!(
            file_name(&mode("  Œuvre / BTP #1 ", &[])),
            "oeuvre-btp-1.nexum.json"
        );
        assert_eq!(file_name(&mode("★★★", &[])), "mode.nexum.json");
    }
}

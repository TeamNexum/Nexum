//! Scrubs secrets out of text before it reaches the log file or a feedback
//! report: the Hue API username, cloud JWTs, bearer tokens, webhook URLs.
//!
//! Two passes: the exact values the app currently holds (registered with
//! [`set_known_secrets`]), then patterns for anything shaped like a credential,
//! so a secret the app never registered (an env var, a pasted token) is still
//! caught.

use std::sync::{LazyLock, RwLock};

use regex::Regex;

const MASK: &str = "[REDACTED]";

/// Shorter values are too likely to match ordinary words.
const MIN_SECRET_LEN: usize = 8;

static KNOWN: RwLock<Vec<String>> = RwLock::new(Vec::new());

static PATTERNS: LazyLock<Vec<(Regex, &'static str)>> = LazyLock::new(|| {
    [
        // Discord webhook: the last path segment is the token.
        (
            r"(?i)(discord(?:app)?\.com/api/webhooks/)\d+/[A-Za-z0-9_-]+",
            "${1}[REDACTED]",
        ),
        // Hue bridge URLs carry the API username: http://<bridge>/api/<user>/…
        (r"(/api/)[A-Za-z0-9_-]{16,}", "${1}[REDACTED]"),
        (r"(?i)\b(bearer\s+)[A-Za-z0-9._~+/=-]+", "${1}[REDACTED]"),
        (
            r"eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]*",
            "[REDACTED_JWT]",
        ),
        // JSON fields: "user": "…", "token": "…", …
        (
            r#"(?i)("(?:user|username|token|access_token|password|secret|api_?key|authorization)"\s*:\s*")[^"]*(")"#,
            "${1}[REDACTED]${2}",
        ),
        // Query strings and key=value pairs.
        (
            r"(?i)\b((?:token|access_token|password|secret|api_?key)=)[^\s&]+",
            "${1}[REDACTED]",
        ),
    ]
    .into_iter()
    .map(|(pattern, replacement)| (Regex::new(pattern).expect("valid pattern"), replacement))
    .collect()
});

/// Replace the set of exact values to scrub (e.g. after the Hue bridge is
/// paired or unpaired).
pub fn set_known_secrets(secrets: impl IntoIterator<Item = String>) {
    *KNOWN.write().unwrap() = prepare(secrets);
}

fn prepare(secrets: impl IntoIterator<Item = String>) -> Vec<String> {
    let mut secrets: Vec<String> = secrets
        .into_iter()
        .filter(|s| s.len() >= MIN_SECRET_LEN)
        .collect();
    // Longest first, so a secret containing another is masked whole.
    secrets.sort_by_key(|s| std::cmp::Reverse(s.len()));
    secrets
}

pub fn redact(text: &str) -> String {
    redact_with(text, &KNOWN.read().unwrap())
}

fn redact_with(text: &str, known: &[String]) -> String {
    let mut text = text.to_string();
    for secret in known {
        if text.contains(secret.as_str()) {
            text = text.replace(secret.as_str(), MASK);
        }
    }
    for (pattern, replacement) in PATTERNS.iter() {
        if let std::borrow::Cow::Owned(replaced) = pattern.replace_all(&text, *replacement) {
            text = replaced;
        }
    }
    text
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn masks_hue_username_in_bridge_urls() {
        let line = "error sending request for url (http://192.168.1.42/api/1028d66426293e821ecfd9ef1a0731df/scenes)";
        let out = redact(line);
        assert!(!out.contains("1028d66426293e821ecfd9ef1a0731df"), "{out}");
        assert!(out.contains("192.168.1.42/api/[REDACTED]/scenes"), "{out}");
    }

    #[test]
    fn leaves_ordinary_api_routes_alone() {
        assert_eq!(redact("GET /api/modes 200"), "GET /api/modes 200");
    }

    #[test]
    fn masks_tokens_and_credentials() {
        let jwt = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMifQ.c2lnbmF0dXJl";
        let cases = [
            format!("Authorization: Bearer {jwt}"),
            format!("cloud token {jwt}"),
            r#"{"bridge":"10.0.0.2","user":"s3cr3t-hue-user"}"#.to_string(),
            "callback?token=abc123def456&x=1".to_string(),
            "https://discord.com/api/webhooks/123456789/AbC_dEf-123".to_string(),
        ];
        for line in cases {
            let out = redact(&line);
            for secret in [jwt, "s3cr3t-hue-user", "abc123def456", "AbC_dEf-123"] {
                assert!(!out.contains(secret), "{secret} leaked in {out}");
            }
        }
        assert_eq!(
            redact(r#"{"bridge":"10.0.0.2"}"#),
            r#"{"bridge":"10.0.0.2"}"#
        );
    }

    #[test]
    fn masks_registered_values_anywhere() {
        // `prepare`/`redact_with` rather than the global list, which other
        // tests running in parallel also write.
        let known = prepare(["short".to_string(), "plain-secret-value".to_string()]);
        assert_eq!(
            redact_with("user plain-secret-value said short", &known),
            "user [REDACTED] said short"
        );
    }
}

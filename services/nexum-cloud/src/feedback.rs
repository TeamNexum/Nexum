//! `POST /api/feedback`: beta testers' reports from the desktop app, forwarded
//! to the team's Discord channel.
//!
//! The webhook URL stays on the server (`NEXUM_FEEDBACK_WEBHOOK`), so the app
//! never ships it. No account is needed to send a report; a per-IP rate limit
//! keeps the channel from being flooded. Behind a reverse proxy every request
//! shares the proxy's IP, so the limit becomes global until it reads the
//! client address from the proxy's headers.

use std::collections::HashMap;
use std::net::{IpAddr, SocketAddr};
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};

use axum::extract::{ConnectInfo, DefaultBodyLimit, State};
use axum::http::StatusCode;
use axum::routing::post;
use axum::{Json, Router};
use base64::Engine as _;
use reqwest::multipart::{Form, Part};
use serde::Deserialize;
use serde_json::json;

use nexum_core::redact::redact;

/// Discord caps an embed description at 4096 characters.
pub const MAX_MESSAGE_CHARS: usize = 4000;
/// Discord caps a message's attachments at 10 MB without a server boost.
const MAX_SCREENSHOT_BYTES: usize = 8 * 1024 * 1024;
const MAX_LOG_BYTES: usize = 1024 * 1024;
/// Base64 screenshot + logs + JSON overhead.
const MAX_BODY_BYTES: usize = 12 * 1024 * 1024;

const RATE_LIMIT: usize = 10;
const RATE_WINDOW: Duration = Duration::from_secs(10 * 60);

#[derive(Debug, Deserialize)]
pub struct Screenshot {
    pub mime: String,
    pub data_base64: String,
}

#[derive(Debug, Deserialize)]
pub struct FeedbackReport {
    pub message: String,
    #[serde(default)]
    pub contact: Option<String>,
    #[serde(default)]
    pub version: String,
    #[serde(default)]
    pub os: String,
    #[serde(default)]
    pub screenshot: Option<Screenshot>,
    /// Present only when the tester agreed to attach their logs.
    #[serde(default)]
    pub logs: Option<String>,
}

pub struct Feedback {
    webhook: Option<String>,
    client: reqwest::Client,
    hits: Mutex<HashMap<IpAddr, Vec<Instant>>>,
}

impl Feedback {
    pub fn new(webhook: Option<String>) -> Self {
        Self {
            webhook: webhook.filter(|url| !url.trim().is_empty()),
            client: reqwest::Client::new(),
            hits: Mutex::default(),
        }
    }

    /// Record a report from `ip` and say whether it is within the limit.
    fn allow(&self, ip: IpAddr, now: Instant) -> bool {
        let mut hits = self.hits.lock().unwrap();
        hits.retain(|_, times| {
            times.retain(|t| now.duration_since(*t) < RATE_WINDOW);
            !times.is_empty()
        });
        let times = hits.entry(ip).or_default();
        if times.len() >= RATE_LIMIT {
            return false;
        }
        times.push(now);
        true
    }
}

pub fn router() -> Router {
    let state = Arc::new(Feedback::new(std::env::var("NEXUM_FEEDBACK_WEBHOOK").ok()));
    if state.webhook.is_none() {
        println!("NEXUM_FEEDBACK_WEBHOOK is not set: /api/feedback will answer 503");
    }
    Router::new()
        .route("/api/feedback", post(post_feedback))
        .layer(DefaultBodyLimit::max(MAX_BODY_BYTES))
        .with_state(state)
}

type Rejection = (StatusCode, Json<serde_json::Value>);

fn reject(status: StatusCode, error: &str) -> Rejection {
    (status, Json(json!({ "error": error })))
}

/// A decoded, size-checked screenshot: (file name, mime, bytes).
type Attachment = (String, String, Vec<u8>);

fn validate(report: &FeedbackReport) -> Result<Option<Attachment>, Rejection> {
    let length = report.message.trim().chars().count();
    if length == 0 {
        return Err(reject(StatusCode::BAD_REQUEST, "Le message est vide."));
    }
    if length > MAX_MESSAGE_CHARS {
        return Err(reject(
            StatusCode::PAYLOAD_TOO_LARGE,
            "Le message dépasse 4000 caractères.",
        ));
    }
    if report
        .logs
        .as_ref()
        .is_some_and(|logs| logs.len() > MAX_LOG_BYTES)
    {
        return Err(reject(
            StatusCode::PAYLOAD_TOO_LARGE,
            "Le journal dépasse 1 Mo.",
        ));
    }
    let Some(screenshot) = &report.screenshot else {
        return Ok(None);
    };
    let ext = match screenshot.mime.as_str() {
        "image/png" => "png",
        "image/jpeg" => "jpg",
        "image/webp" => "webp",
        "image/gif" => "gif",
        _ => {
            return Err(reject(
                StatusCode::UNSUPPORTED_MEDIA_TYPE,
                "Format de capture non pris en charge (PNG, JPEG, WebP ou GIF).",
            ))
        }
    };
    let bytes = base64::engine::general_purpose::STANDARD
        .decode(&screenshot.data_base64)
        .map_err(|_| reject(StatusCode::BAD_REQUEST, "Capture illisible."))?;
    if bytes.len() > MAX_SCREENSHOT_BYTES {
        return Err(reject(
            StatusCode::PAYLOAD_TOO_LARGE,
            "La capture dépasse 8 Mo.",
        ));
    }
    Ok(Some((
        format!("capture.{ext}"),
        screenshot.mime.clone(),
        bytes,
    )))
}

fn field(value: &str, max: usize) -> String {
    let value: String = value.trim().chars().take(max).collect();
    if value.is_empty() {
        "?".into()
    } else {
        value
    }
}

/// The Discord message: the tester's text in an embed (no pings allowed),
/// plus version and OS so a report can be matched to a build.
fn payload(report: &FeedbackReport, screenshot_name: Option<&str>) -> serde_json::Value {
    let mut fields = vec![
        json!({ "name": "Version", "value": field(&report.version, 100), "inline": true }),
        json!({ "name": "Système", "value": field(&report.os, 100), "inline": true }),
        json!({
            "name": "Journal joint",
            "value": if report.logs.is_some() { "Oui" } else { "Non" },
            "inline": true,
        }),
    ];
    if let Some(contact) = report.contact.as_deref().filter(|c| !c.trim().is_empty()) {
        fields.push(json!({ "name": "Contact", "value": field(contact, 200) }));
    }
    let mut embed = json!({
        "title": "Retour bêta-testeur",
        "description": redact(report.message.trim()),
        "color": 0x7c5cff,
        "fields": fields,
    });
    if let Some(name) = screenshot_name {
        embed["image"] = json!({ "url": format!("attachment://{name}") });
    }
    json!({ "allowed_mentions": { "parse": [] }, "embeds": [embed] })
}

async fn post_feedback(
    State(feedback): State<Arc<Feedback>>,
    ConnectInfo(addr): ConnectInfo<SocketAddr>,
    Json(report): Json<FeedbackReport>,
) -> Result<StatusCode, Rejection> {
    let screenshot = validate(&report)?;
    let webhook = feedback.webhook.as_deref().ok_or_else(|| {
        reject(
            StatusCode::SERVICE_UNAVAILABLE,
            "Les retours ne sont pas configurés sur ce serveur.",
        )
    })?;
    if !feedback.allow(addr.ip(), Instant::now()) {
        return Err(reject(
            StatusCode::TOO_MANY_REQUESTS,
            "Trop de retours envoyés : réessayez dans quelques minutes.",
        ));
    }

    let mut form = Form::new().text(
        "payload_json",
        payload(&report, screenshot.as_ref().map(|(name, ..)| name.as_str())).to_string(),
    );
    let mut index = 0;
    if let Some((name, mime, bytes)) = screenshot {
        let part = Part::bytes(bytes)
            .file_name(name)
            .mime_str(&mime)
            .expect("allowlisted mime");
        form = form.part(format!("files[{index}]"), part);
        index += 1;
    }
    if let Some(logs) = &report.logs {
        // The app already redacts; do it again in case an older build did not.
        let part = Part::bytes(redact(logs).into_bytes())
            .file_name("nexum-logs.txt")
            .mime_str("text/plain; charset=utf-8")
            .expect("valid mime");
        form = form.part(format!("files[{index}]"), part);
    }

    // `without_url`: the webhook URL is a secret, keep it out of the server logs.
    let unreachable = || {
        reject(
            StatusCode::BAD_GATEWAY,
            "Le retour n'a pas pu être transmis à l'équipe.",
        )
    };
    let response = feedback
        .client
        .post(webhook)
        .multipart(form)
        .timeout(Duration::from_secs(30))
        .send()
        .await
        .map_err(|e| {
            eprintln!("feedback: webhook unreachable: {}", e.without_url());
            unreachable()
        })?;
    if !response.status().is_success() {
        eprintln!("feedback: webhook answered HTTP {}", response.status());
        return Err(unreachable());
    }
    Ok(StatusCode::NO_CONTENT)
}

#[cfg(test)]
mod tests {
    use super::*;

    fn report() -> FeedbackReport {
        FeedbackReport {
            message: "  Le mode Gaming ne lance pas Steam  ".into(),
            contact: Some("  sam@exemple.com ".into()),
            version: "0.1.0".into(),
            os: "linux (x86_64)".into(),
            screenshot: None,
            logs: None,
        }
    }

    fn png() -> Screenshot {
        Screenshot {
            mime: "image/png".into(),
            data_base64: "iVBORw0KGgo=".into(),
        }
    }

    #[test]
    fn validation_rejects_bad_reports() {
        let empty = FeedbackReport {
            message: "   ".into(),
            ..report()
        };
        assert_eq!(validate(&empty).unwrap_err().0, StatusCode::BAD_REQUEST);

        let svg = FeedbackReport {
            screenshot: Some(Screenshot {
                mime: "image/svg+xml".into(),
                data_base64: String::new(),
            }),
            ..report()
        };
        assert_eq!(
            validate(&svg).unwrap_err().0,
            StatusCode::UNSUPPORTED_MEDIA_TYPE
        );

        let huge_logs = FeedbackReport {
            logs: Some("x".repeat(MAX_LOG_BYTES + 1)),
            ..report()
        };
        assert_eq!(
            validate(&huge_logs).unwrap_err().0,
            StatusCode::PAYLOAD_TOO_LARGE
        );

        let ok = FeedbackReport {
            screenshot: Some(png()),
            ..report()
        };
        let (name, mime, bytes) = validate(&ok).unwrap().unwrap();
        assert_eq!(
            (name.as_str(), mime.as_str(), bytes.len()),
            ("capture.png", "image/png", 8)
        );
    }

    #[test]
    fn payload_disables_mentions_and_carries_context() {
        let body = payload(
            &FeedbackReport {
                logs: Some(String::new()),
                ..report()
            },
            Some("capture.png"),
        );
        assert_eq!(body["allowed_mentions"]["parse"], json!([]));
        let embed = &body["embeds"][0];
        assert_eq!(embed["description"], "Le mode Gaming ne lance pas Steam");
        assert_eq!(embed["image"]["url"], "attachment://capture.png");
        let fields = embed["fields"].as_array().unwrap();
        assert!(fields
            .iter()
            .any(|f| f["name"] == "Version" && f["value"] == "0.1.0"));
        assert!(fields
            .iter()
            .any(|f| f["name"] == "Journal joint" && f["value"] == "Oui"));
        assert!(fields
            .iter()
            .any(|f| f["name"] == "Contact" && f["value"] == "sam@exemple.com"));

        let bare = payload(
            &FeedbackReport {
                contact: Some(" ".into()),
                version: String::new(),
                ..report()
            },
            None,
        );
        assert!(bare["embeds"][0].get("image").is_none());
        let fields = bare["embeds"][0]["fields"].as_array().unwrap();
        assert!(!fields.iter().any(|f| f["name"] == "Contact"));
        assert!(fields
            .iter()
            .any(|f| f["name"] == "Version" && f["value"] == "?"));
    }

    #[test]
    fn rate_limit_is_per_ip_and_expires() {
        let feedback = Feedback::new(None);
        let (a, b): (IpAddr, IpAddr) = ("10.0.0.1".parse().unwrap(), "10.0.0.2".parse().unwrap());
        let start = Instant::now();
        for _ in 0..RATE_LIMIT {
            assert!(feedback.allow(a, start));
        }
        assert!(!feedback.allow(a, start));
        assert!(feedback.allow(b, start));
        assert!(feedback.allow(a, start + RATE_WINDOW));
    }

    async fn send(
        feedback: Arc<Feedback>,
        report: FeedbackReport,
    ) -> Result<StatusCode, Rejection> {
        let addr: SocketAddr = "10.0.0.1:5000".parse().unwrap();
        post_feedback(State(feedback), ConnectInfo(addr), Json(report)).await
    }

    #[tokio::test]
    async fn without_a_webhook_the_route_is_unavailable() {
        let result = send(Arc::new(Feedback::new(Some("  ".into()))), report()).await;
        assert_eq!(result.unwrap_err().0, StatusCode::SERVICE_UNAVAILABLE);
    }

    /// End to end against a fake Discord: the report arrives as multipart with
    /// the embed, the screenshot and the (re-)redacted logs.
    #[tokio::test]
    async fn forwards_the_report_to_the_webhook() {
        let received = Arc::new(Mutex::new(Vec::new()));
        let sink = received.clone();
        let discord = Router::new().route(
            "/webhook",
            post(move |body: axum::body::Bytes| async move {
                sink.lock().unwrap().extend_from_slice(&body);
                StatusCode::NO_CONTENT
            }),
        );
        let listener = tokio::net::TcpListener::bind("127.0.0.1:0").await.unwrap();
        let url = format!("http://{}/webhook", listener.local_addr().unwrap());
        tokio::spawn(async move { axum::serve(listener, discord).await.unwrap() });

        let report = FeedbackReport {
            screenshot: Some(png()),
            logs: Some("GET http://10.0.0.2/api/abcdefghijklmnopqrstuvwxyz/scenes".into()),
            ..report()
        };
        assert_eq!(
            send(Arc::new(Feedback::new(Some(url))), report)
                .await
                .unwrap(),
            StatusCode::NO_CONTENT
        );

        let body = String::from_utf8_lossy(&received.lock().unwrap()).into_owned();
        assert!(body.contains(r#"name="payload_json""#));
        assert!(body.contains("Le mode Gaming ne lance pas Steam"));
        assert!(body.contains(r#"name="files[0]"; filename="capture.png""#));
        assert!(body.contains(r#"name="files[1]"; filename="nexum-logs.txt""#));
        assert!(body.contains("/api/[REDACTED]/scenes"));
        assert!(!body.contains("abcdefghijklmnopqrstuvwxyz"));
    }

    #[tokio::test]
    async fn a_failing_webhook_is_reported_as_bad_gateway() {
        // Nothing listens on port 9 (discard) on loopback.
        let feedback = Arc::new(Feedback::new(Some("http://127.0.0.1:9/webhook".into())));
        assert_eq!(
            send(feedback, report()).await.unwrap_err().0,
            StatusCode::BAD_GATEWAY
        );
    }
}

//! Nexum Cloud API.
//!
//! - `GET  /health`
//! - `POST /api/ai/generate`         — Mode-as-Code (heuristic, or Claude with the `claude` feature)
//! - `POST /api/auth/register`       — {email,password} -> {token}
//! - `POST /api/auth/login`          — {email,password} -> {token}
//! - `GET  /api/modes`   (auth)      — this user's synced modes
//! - `PUT  /api/modes`   (auth)      — replace this user's modes (sync push)
//! - `POST /api/commands`      (auth) — mobile enqueues a RemoteCommand
//! - `GET  /api/commands/next` (auth) — desktop polls the next command (or null)
//!
//! Auth is a Bearer JWT (see `auth.rs`). Storage is in-memory (`store.rs`) —
//! swap for PostgreSQL in production. This backend unblocks multi-device sync,
//! the mobile companion, and the Marketplace import flow.

mod auth;
#[cfg(feature = "claude")]
mod claude;
mod store;

use std::sync::Arc;

use axum::{
    extract::State,
    http::{
        header::{AUTHORIZATION, CONTENT_TYPE},
        HeaderMap, StatusCode,
    },
    routing::{get, post},
    Json, Router,
};
use serde::Deserialize;
use serde_json::json;
use tower_http::cors::{Any, CorsLayer};
use uuid::Uuid;

use nexum_core::ai::generate_mode;
use nexum_schema::Mode;
use store::{CloudStore, RemoteCommand};

#[tokio::main]
async fn main() {
    let store = Arc::new(CloudStore::new());

    let app = Router::new()
        .route("/health", get(health))
        .route("/api/status", get(get_status))
        .route("/api/ai/generate", post(ai_generate))
        .route("/api/auth/register", post(register))
        .route("/api/auth/login", post(login))
        .route("/api/modes", get(get_modes).put(put_modes))
        .route("/api/commands", post(post_command))
        .route("/api/commands/next", get(next_command))
        .route("/api/direct/command", post(post_direct_command))
        .route("/api/direct/commands/next", get(next_direct_command))
        .route("/api/direct/modes", get(get_direct_modes).put(put_direct_modes))
        // Permissive CORS so the desktop webview (tauri://) and the web mobile
        // companion can call the API cross-origin. Headers are listed explicitly
        // because the `*` wildcard does NOT authorize `Authorization` (Fetch spec
        // carve-out), which every authed request sends. Tighten for production.
        .layer(
            CorsLayer::new()
                .allow_origin(Any)
                .allow_methods(Any)
                .allow_headers([AUTHORIZATION, CONTENT_TYPE]),
        )
        .with_state(store);

    // Default to 0.0.0.0:8787 so the mobile companion on LAN or via tunnel can reach it.
    let addr = std::env::var("NEXUM_CLOUD_ADDR").unwrap_or_else(|_| "0.0.0.0:8787".to_string());
    let listener = tokio::net::TcpListener::bind(&addr)
        .await
        .expect("failed to bind");
    println!("Nexum Cloud API listening on http://{addr}");
    axum::serve(listener, app).await.expect("server error");
}

async fn health() -> Json<serde_json::Value> {
    Json(json!({ "status": "ok", "service": "nexum-cloud", "version": env!("CARGO_PKG_VERSION") }))
}

// ---- AI (Mode-as-Code) -----------------------------------------------------

#[derive(Deserialize)]
struct GenerateRequest {
    prompt: String,
}

async fn ai_generate(Json(req): Json<GenerateRequest>) -> Json<Mode> {
    #[cfg(feature = "claude")]
    {
        match claude::generate_via_claude(&req.prompt).await {
            Ok(mode) => return Json(mode),
            Err(e) => eprintln!("claude generation failed, using heuristic: {e}"),
        }
    }
    Json(generate_mode(&req.prompt, Uuid::new_v4()))
}

// ---- Auth ------------------------------------------------------------------

#[derive(Deserialize)]
struct AuthRequest {
    email: String,
    password: String,
}

async fn register(
    State(store): State<Arc<CloudStore>>,
    Json(req): Json<AuthRequest>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    let user_id = store
        .register(&req.email, &req.password)
        .map_err(|_| StatusCode::CONFLICT)?;
    Ok(Json(json!({ "token": auth::issue_token(&user_id) })))
}

async fn login(
    State(store): State<Arc<CloudStore>>,
    Json(req): Json<AuthRequest>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    let user_id = store
        .authenticate(&req.email, &req.password)
        .ok_or(StatusCode::UNAUTHORIZED)?;
    Ok(Json(json!({ "token": auth::issue_token(&user_id) })))
}

/// Extract and verify the Bearer token, returning the user id.
fn user_from(headers: &HeaderMap) -> Option<String> {
    let value = headers.get("authorization")?.to_str().ok()?;
    let token = value.strip_prefix("Bearer ")?;
    auth::verify_token(token)
}

// ---- Sync ------------------------------------------------------------------

async fn get_modes(
    State(store): State<Arc<CloudStore>>,
    headers: HeaderMap,
) -> Result<Json<Vec<Mode>>, StatusCode> {
    let user_id = user_from(&headers).ok_or(StatusCode::UNAUTHORIZED)?;
    Ok(Json(store.get_modes(&user_id)))
}

async fn put_modes(
    State(store): State<Arc<CloudStore>>,
    headers: HeaderMap,
    Json(modes): Json<Vec<Mode>>,
) -> Result<StatusCode, StatusCode> {
    let user_id = user_from(&headers).ok_or(StatusCode::UNAUTHORIZED)?;
    store.put_modes(&user_id, modes);
    Ok(StatusCode::NO_CONTENT)
}

// ---- Remote control (mobile companion) -------------------------------------

/// The mobile app enqueues a command; the user's desktop picks it up by polling.
async fn post_command(
    State(store): State<Arc<CloudStore>>,
    headers: HeaderMap,
    Json(cmd): Json<RemoteCommand>,
) -> Result<StatusCode, StatusCode> {
    let user_id = user_from(&headers).ok_or(StatusCode::UNAUTHORIZED)?;
    store.enqueue_command(&user_id, cmd);
    Ok(StatusCode::ACCEPTED)
}

/// The desktop polls this; returns `{ "command": <RemoteCommand> | null }`.
async fn next_command(
    State(store): State<Arc<CloudStore>>,
    headers: HeaderMap,
) -> Result<Json<serde_json::Value>, StatusCode> {
    let user_id = user_from(&headers).ok_or(StatusCode::UNAUTHORIZED)?;
    Ok(Json(json!({ "command": store.take_command(&user_id) })))
}

// ---- Direct / Local Remote (LAN & Tunnel) -----------------------------------

async fn post_direct_command(
    State(store): State<Arc<CloudStore>>,
    Json(cmd): Json<RemoteCommand>,
) -> StatusCode {
    store.enqueue_direct_command(cmd);
    StatusCode::ACCEPTED
}

async fn next_direct_command(
    State(store): State<Arc<CloudStore>>,
) -> Json<serde_json::Value> {
    Json(json!({ "command": store.take_direct_command() }))
}

async fn get_direct_modes(
    State(store): State<Arc<CloudStore>>,
) -> Json<Vec<Mode>> {
    let modes = store.get_direct_modes();
    if modes.is_empty() {
        Json(vec![
            Mode {
                id: Uuid::from_u128(0x6a),
                name: "Gaming (PC)".into(),
                description: Some("Volume 70%, luminosité 100%, Hue Purple Night & Steam".into()),
                category: nexum_schema::Category::Gaming,
                steps: vec![],
            },
            Mode {
                id: Uuid::from_u128(0x77),
                name: "Work (PC)".into(),
                description: Some("Volume 20%, luminosité 70%, Hue Focus White & documents".into()),
                category: nexum_schema::Category::Work,
                steps: vec![],
            },
            Mode {
                id: Uuid::from_u128(0xc1),
                name: "Chill (PC)".into(),
                description: Some("Volume 40%, Hue Sunset Glow & Spotify Web".into()),
                category: nexum_schema::Category::Chill,
                steps: vec![],
            },
        ])
    } else {
        Json(modes)
    }
}

async fn put_direct_modes(
    State(store): State<Arc<CloudStore>>,
    Json(modes): Json<Vec<Mode>>,
) -> StatusCode {
    store.set_direct_modes(modes);
    StatusCode::NO_CONTENT
}

async fn get_status() -> Json<serde_json::Value> {
    let hostname = std::env::var("COMPUTERNAME").unwrap_or_else(|_| "Nexum PC".to_string());
    Json(json!({
        "status": "online",
        "service": "nexum-cloud",
        "version": env!("CARGO_PKG_VERSION"),
        "hostname": hostname,
    }))
}

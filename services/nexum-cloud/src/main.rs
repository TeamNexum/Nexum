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
mod store;
#[cfg(feature = "claude")]
mod claude;

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
        .route("/api/ai/generate", post(ai_generate))
        .route("/api/auth/register", post(register))
        .route("/api/auth/login", post(login))
        .route("/api/modes", get(get_modes).put(put_modes))
        .route("/api/commands", post(post_command))
        .route("/api/commands/next", get(next_command))
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

    // Default to localhost only. Set NEXUM_CLOUD_ADDR=0.0.0.0:8787 to expose the
    // API on the LAN so the mobile companion (on the same network) can reach it.
    let addr = std::env::var("NEXUM_CLOUD_ADDR").unwrap_or_else(|_| "127.0.0.1:8787".to_string());
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

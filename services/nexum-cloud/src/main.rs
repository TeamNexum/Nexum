//! Nexum Cloud API.
//!
//! - `GET  /health`
//! - `POST /api/ai/generate`         — Mode-as-Code (heuristic, or Claude with the `claude` feature)
//! - `POST /api/auth/register`       — {email,password} -> session
//! - `POST /api/auth/login`          — {email,password} -> session
//! - `POST /api/auth/refresh`        — {refresh_token} -> new session
//! - `POST /api/auth/logout`         — {refresh_token} -> revokes that session
//! - `GET  /api/modes`   (auth)      — this user's synced modes
//! - `POST /api/modes/sync` (auth)   — apply client edits, return the current state
//! - `POST /api/commands`      (auth) — mobile enqueues a RemoteCommand
//! - `GET  /api/commands/next` (auth) — desktop polls the next command (or null)
//! - `POST /api/feedback`            — beta feedback, forwarded to Discord (see `feedback.rs`)
//! - `/api/direct/*`                 — no-account LAN remote for NexumAndroid (see `direct.rs`)
//! - `GET  /api/status`              — host name, for the phone's "PC online" check
//!
//! A session is {token,refresh_token,user_id}. Auth is a Bearer JWT (see `auth.rs`), passwords are Argon2id hashes (see
//! `password.rs`). Storage is PostgreSQL when `DATABASE_URL` is set, in memory
//! otherwise (see `store/`). This backend unblocks multi-device sync, the
//! mobile companion, and the Marketplace import flow.

mod auth;
#[cfg(feature = "claude")]
mod claude;
mod direct;
mod feedback;
mod password;
mod store;

use std::net::SocketAddr;
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
use store::{
    normalize_email, MemoryStore, ModeChange, PgStore, RemoteCommand, SharedStore, StoreError,
    SyncOutcome,
};

#[tokio::main]
async fn main() {
    let database_url = std::env::var("DATABASE_URL")
        .ok()
        .filter(|url| !url.trim().is_empty());
    if let Err(e) = auth::init_secret(database_url.is_none()) {
        eprintln!("{e}");
        std::process::exit(1);
    }
    let store: SharedStore = match &database_url {
        Some(url) => match PgStore::connect(url).await {
            Ok(store) => {
                println!("Storage: PostgreSQL");
                Arc::new(store)
            }
            Err(e) => {
                eprintln!("could not open the database: {e}");
                std::process::exit(1);
            }
        },
        None => {
            println!("DATABASE_URL is not set: storing everything in memory (lost on restart)");
            Arc::new(MemoryStore::new())
        }
    };

    // Default to localhost only. `--lan` (npm run dev:cloud:lan) or
    // NEXUM_CLOUD_ADDR=0.0.0.0:8787 exposes the API on the LAN so the mobile
    // companion / Android app on the same network can reach it.
    let lan = std::env::args().any(|arg| arg == "--lan");
    let default_addr = if lan { "0.0.0.0:8787" } else { "127.0.0.1:8787" };
    let addr = std::env::var("NEXUM_CLOUD_ADDR").unwrap_or_else(|_| default_addr.to_string());
    let listener = tokio::net::TcpListener::bind(&addr)
        .await
        .expect("failed to bind");
    println!("Nexum Cloud API listening on http://{addr}");
    // Connect info gives the feedback route the client IP for its rate limit.
    axum::serve(
        listener,
        router(store).into_make_service_with_connect_info::<SocketAddr>(),
    )
    .await
    .expect("server error");
}

fn router(store: SharedStore) -> Router {
    Router::new()
        .route("/health", get(health))
        .route("/api/status", get(get_status))
        .route("/api/ai/generate", post(ai_generate))
        .route("/api/auth/register", post(register))
        .route("/api/auth/login", post(login))
        .route("/api/auth/refresh", post(refresh))
        .route("/api/auth/logout", post(logout))
        .route("/api/modes", get(get_modes))
        .route("/api/modes/sync", post(sync_modes))
        .route("/api/commands", post(post_command))
        .route("/api/commands/next", get(next_command))
        .with_state(store)
        .merge(feedback::router())
        .merge(direct::router())
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
    State(store): State<SharedStore>,
    Json(req): Json<AuthRequest>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    let email = normalize_email(&req.email);
    if !email.contains('@') || req.password.chars().count() < password::MIN_LENGTH {
        return Err(StatusCode::BAD_REQUEST);
    }
    let pass_hash = password::hash(req.password).await;
    let user_id = store
        .create_user(&email, &pass_hash)
        .await
        .map_err(|e| match e {
            StoreError::EmailTaken => StatusCode::CONFLICT,
            e => internal(e),
        })?;
    Ok(Json(start_session(&store, user_id).await?))
}

async fn login(
    State(store): State<SharedStore>,
    Json(req): Json<AuthRequest>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    let user = store
        .find_user(&normalize_email(&req.email))
        .await
        .map_err(internal)?
        .ok_or(StatusCode::UNAUTHORIZED)?;
    if !password::verify(req.password, user.pass_hash).await {
        return Err(StatusCode::UNAUTHORIZED);
    }
    Ok(Json(start_session(&store, user.id).await?))
}

#[derive(Deserialize)]
struct RefreshRequest {
    refresh_token: String,
}

/// Swap a refresh token for a new session. 401 tells the client to sign in again.
async fn refresh(
    State(store): State<SharedStore>,
    Json(req): Json<RefreshRequest>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    let (refresh_token, new_hash) = auth::new_refresh_token();
    let user_id = store
        .rotate_refresh_token(
            &auth::hash_refresh_token(&req.refresh_token),
            &new_hash,
            auth::REFRESH_TOKEN_TTL,
        )
        .await
        .map_err(internal)?
        .ok_or(StatusCode::UNAUTHORIZED)?;
    Ok(Json(session_json(user_id, &refresh_token)))
}

async fn logout(
    State(store): State<SharedStore>,
    Json(req): Json<RefreshRequest>,
) -> Result<StatusCode, StatusCode> {
    store
        .revoke_refresh_token(&auth::hash_refresh_token(&req.refresh_token))
        .await
        .map_err(internal)?;
    Ok(StatusCode::NO_CONTENT)
}

async fn start_session(
    store: &SharedStore,
    user_id: Uuid,
) -> Result<serde_json::Value, StatusCode> {
    let (refresh_token, hash) = auth::new_refresh_token();
    store
        .create_refresh_token(user_id, &hash, auth::REFRESH_TOKEN_TTL)
        .await
        .map_err(internal)?;
    Ok(session_json(user_id, &refresh_token))
}

fn session_json(user_id: Uuid, refresh_token: &str) -> serde_json::Value {
    json!({
        "token": auth::issue_token(&user_id.to_string()),
        "refresh_token": refresh_token,
        "user_id": user_id,
    })
}

/// Extract and verify the Bearer token, returning the user id.
fn user_from(headers: &HeaderMap) -> Result<Uuid, StatusCode> {
    let value = headers
        .get("authorization")
        .and_then(|v| v.to_str().ok())
        .ok_or(StatusCode::UNAUTHORIZED)?;
    let token = value
        .strip_prefix("Bearer ")
        .ok_or(StatusCode::UNAUTHORIZED)?;
    auth::verify_token(token)
        .and_then(|id| Uuid::parse_str(&id).ok())
        .ok_or(StatusCode::UNAUTHORIZED)
}

/// Log a storage failure and answer 500 (details stay in the server logs).
fn internal(e: StoreError) -> StatusCode {
    eprintln!("{e}");
    StatusCode::INTERNAL_SERVER_ERROR
}

// ---- Sync ------------------------------------------------------------------

async fn get_modes(
    State(store): State<SharedStore>,
    headers: HeaderMap,
) -> Result<Json<Vec<Mode>>, StatusCode> {
    let user_id = user_from(&headers)?;
    Ok(Json(store.get_modes(user_id).await.map_err(internal)?))
}

#[derive(Deserialize)]
struct SyncRequest {
    changes: Vec<ModeChange>,
}

async fn sync_modes(
    State(store): State<SharedStore>,
    headers: HeaderMap,
    Json(req): Json<SyncRequest>,
) -> Result<Json<SyncOutcome>, StatusCode> {
    let user_id = user_from(&headers)?;
    let consistent = |c: &ModeChange| c.mode.as_ref().is_none_or(|mode| mode.id == c.id);
    if !req.changes.iter().all(consistent) {
        return Err(StatusCode::BAD_REQUEST);
    }
    let outcome = store
        .sync_modes(user_id, req.changes)
        .await
        .map_err(internal)?;
    Ok(Json(outcome))
}

// ---- Remote control (mobile companion) -------------------------------------

/// The mobile app enqueues a command; the user's desktop picks it up by polling.
async fn post_command(
    State(store): State<SharedStore>,
    headers: HeaderMap,
    Json(cmd): Json<RemoteCommand>,
) -> Result<StatusCode, StatusCode> {
    let user_id = user_from(&headers)?;
    store
        .enqueue_command(user_id, cmd)
        .await
        .map_err(internal)?;
    Ok(StatusCode::ACCEPTED)
}

/// The desktop polls this; returns `{ "command": <RemoteCommand> | null }`.
async fn next_command(
    State(store): State<SharedStore>,
    headers: HeaderMap,
) -> Result<Json<serde_json::Value>, StatusCode> {
    let user_id = user_from(&headers)?;
    let command = store.take_command(user_id).await.map_err(internal)?;
    Ok(Json(json!({ "command": command })))
}

// ---- Status (mobile companion) --------------------------------------------

async fn get_status() -> Json<serde_json::Value> {
    let hostname = std::env::var("COMPUTERNAME").unwrap_or_else(|_| "Nexum PC".to_string());
    Json(json!({
        "status": "online",
        "service": "nexum-cloud",
        "version": env!("CARGO_PKG_VERSION"),
        "hostname": hostname,
    }))
}

#[cfg(test)]
mod tests {
    use axum::body::Body;
    use axum::http::Request;
    use serde_json::Value;
    use tower::ServiceExt;

    use super::*;

    fn app() -> Router {
        router(Arc::new(MemoryStore::new()))
    }

    async fn call(
        app: &Router,
        method: &str,
        path: &str,
        token: Option<&str>,
        body: Value,
    ) -> (StatusCode, Value) {
        let mut request = Request::builder()
            .method(method)
            .uri(path)
            .header("content-type", "application/json");
        if let Some(token) = token {
            request = request.header("authorization", format!("Bearer {token}"));
        }
        let response = app
            .clone()
            .oneshot(request.body(Body::from(body.to_string())).unwrap())
            .await
            .unwrap();
        let status = response.status();
        let bytes = axum::body::to_bytes(response.into_body(), usize::MAX)
            .await
            .unwrap();
        (
            status,
            serde_json::from_slice(&bytes).unwrap_or(Value::Null),
        )
    }

    async fn sign_up(app: &Router) -> Value {
        let body = json!({ "email": "Sam@X.com", "password": "longenough" });
        let (status, session) = call(app, "POST", "/api/auth/register", None, body).await;
        assert_eq!(status, StatusCode::OK);
        session
    }

    fn refresh_body(session: &Value) -> Value {
        json!({ "refresh_token": session["refresh_token"] })
    }

    #[tokio::test]
    async fn register_validates_and_login_finds_the_account() {
        let app = app();
        for bad in [
            json!({ "email": "sam@x.com", "password": "short" }),
            json!({ "email": "not-an-email", "password": "longenough" }),
        ] {
            let (status, _) = call(&app, "POST", "/api/auth/register", None, bad).await;
            assert_eq!(status, StatusCode::BAD_REQUEST);
        }
        sign_up(&app).await;
        let login = |password: &'static str| {
            let app = app.clone();
            async move {
                let body = json!({ "email": " sam@X.com ", "password": password });
                call(&app, "POST", "/api/auth/login", None, body).await.0
            }
        };
        assert_eq!(login("longenough").await, StatusCode::OK);
        assert_eq!(login("wrong-password").await, StatusCode::UNAUTHORIZED);
    }

    #[tokio::test]
    async fn refresh_rotates_and_reuse_ends_the_session() {
        let app = app();
        let first = sign_up(&app).await;

        let (status, second) = call(
            &app,
            "POST",
            "/api/auth/refresh",
            None,
            refresh_body(&first),
        )
        .await;
        assert_eq!(status, StatusCode::OK);
        assert_ne!(first["refresh_token"], second["refresh_token"]);
        let (status, _) = call(
            &app,
            "GET",
            "/api/modes",
            second["token"].as_str(),
            json!(null),
        )
        .await;
        assert_eq!(status, StatusCode::OK);

        // The old token comes back: treated as stolen, so the new one dies too.
        for session in [&first, &second] {
            let (status, _) = call(
                &app,
                "POST",
                "/api/auth/refresh",
                None,
                refresh_body(session),
            )
            .await;
            assert_eq!(status, StatusCode::UNAUTHORIZED);
        }
    }

    #[tokio::test]
    async fn logout_revokes_the_refresh_token() {
        let app = app();
        let session = sign_up(&app).await;
        let (status, _) = call(
            &app,
            "POST",
            "/api/auth/logout",
            None,
            refresh_body(&session),
        )
        .await;
        assert_eq!(status, StatusCode::NO_CONTENT);
        let (status, _) = call(
            &app,
            "POST",
            "/api/auth/refresh",
            None,
            refresh_body(&session),
        )
        .await;
        assert_eq!(status, StatusCode::UNAUTHORIZED);
    }

    #[tokio::test]
    async fn sync_needs_auth_and_reports_conflicts() {
        let app = app();
        let session = sign_up(&app).await;
        let token = session["token"].as_str();
        let id = Uuid::new_v4();
        let mode =
            |name: &str| json!({ "id": id, "name": name, "category": "custom", "steps": [] });
        let change = |base: i64, name: &str| json!({ "changes": [{ "id": id, "base_revision": base, "mode": mode(name) }] });

        let (status, _) = call(&app, "POST", "/api/modes/sync", None, change(0, "A")).await;
        assert_eq!(status, StatusCode::UNAUTHORIZED);

        let (status, created) = call(&app, "POST", "/api/modes/sync", token, change(0, "A")).await;
        assert_eq!(status, StatusCode::OK);
        assert_eq!(created["conflicts"], json!([]));
        let revision = created["modes"][0]["revision"].as_i64().unwrap();
        assert!(revision > 0);

        let (_, stale) = call(&app, "POST", "/api/modes/sync", token, change(0, "B")).await;
        assert_eq!(stale["conflicts"], json!([id]));
        assert_eq!(stale["modes"][0]["mode"]["name"], "A");

        let (_, edited) = call(
            &app,
            "POST",
            "/api/modes/sync",
            token,
            change(revision, "B"),
        )
        .await;
        assert_eq!(edited["modes"][0]["mode"]["name"], "B");

        // A change whose id doesn't match its mode is malformed.
        let wrong_id =
            json!({ "changes": [{ "id": Uuid::new_v4(), "base_revision": 0, "mode": mode("C") }] });
        let (status, _) = call(&app, "POST", "/api/modes/sync", token, wrong_id).await;
        assert_eq!(status, StatusCode::BAD_REQUEST);
    }
}

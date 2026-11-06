//! Direct / local remote (LAN & tunnel), no account needed.
//!
//! - `POST /api/direct/command`       — phone enqueues a RemoteCommand
//! - `GET  /api/direct/commands/next` — desktop polls the next command (or null)
//! - `GET  /api/direct/modes`         — modes last pushed by the desktop (demo set if none)
//! - `PUT  /api/direct/modes`         — desktop publishes its modes
//!
//! Used by NexumAndroid when the user is not signed in. A single global queue,
//! in memory only, and deliberately separate from `store/` (accounts + Postgres).
//! Anyone who can reach the API can use it: keep the server on a trusted network.

use std::collections::VecDeque;
use std::sync::{Arc, Mutex, MutexGuard};

use axum::extract::State;
use axum::http::StatusCode;
use axum::routing::{get, post};
use axum::{Json, Router};
use serde_json::json;
use uuid::Uuid;

use nexum_schema::{Category, Mode};

use crate::store::RemoteCommand;

#[derive(Default)]
struct Direct {
    commands: Mutex<VecDeque<RemoteCommand>>,
    modes: Mutex<Vec<Mode>>,
}

/// A poisoned lock only means another request panicked mid-write; the data is
/// still usable, so recover it instead of crashing every later request.
fn lock<T>(m: &Mutex<T>) -> MutexGuard<'_, T> {
    m.lock().unwrap_or_else(|poisoned| poisoned.into_inner())
}

pub fn router() -> Router {
    Router::new()
        .route("/api/direct/command", post(post_command))
        .route("/api/direct/commands/next", get(next_command))
        .route("/api/direct/modes", get(get_modes).put(put_modes))
        .with_state(Arc::new(Direct::default()))
}

async fn post_command(State(direct): State<Arc<Direct>>, Json(cmd): Json<RemoteCommand>) -> StatusCode {
    lock(&direct.commands).push_back(cmd);
    StatusCode::ACCEPTED
}

async fn next_command(State(direct): State<Arc<Direct>>) -> Json<serde_json::Value> {
    let command = lock(&direct.commands).pop_front();
    Json(json!({ "command": command }))
}

async fn get_modes(State(direct): State<Arc<Direct>>) -> Json<Vec<Mode>> {
    let modes = lock(&direct.modes).clone();
    if modes.is_empty() {
        Json(demo_modes())
    } else {
        Json(modes)
    }
}

async fn put_modes(State(direct): State<Arc<Direct>>, Json(modes): Json<Vec<Mode>>) -> StatusCode {
    *lock(&direct.modes) = modes;
    StatusCode::NO_CONTENT
}

/// Shown to the phone until a desktop has published its real modes.
fn demo_modes() -> Vec<Mode> {
    let mode = |id: u128, name: &str, description: &str, category: Category| Mode {
        id: Uuid::from_u128(id),
        name: name.into(),
        description: Some(description.into()),
        category,
        voice_keywords: vec![],
        steps: vec![],
    };
    vec![
        mode(0x6a, "Gaming (PC)", "Volume 70%, luminosité 100%, Hue Purple Night & Steam", Category::Gaming),
        mode(0x77, "Work (PC)", "Volume 20%, luminosité 70%, Hue Focus White & documents", Category::Work),
        mode(0xc1, "Chill (PC)", "Volume 40%, Hue Sunset Glow & Spotify Web", Category::Chill),
    ]
}

//! Storage for the cloud API: users, synced modes and the remote-command queue.
//!
//! [`PgStore`] is the real backend (PostgreSQL, used when `DATABASE_URL` is
//! set). [`MemoryStore`] keeps everything in process memory, so `npm run
//! dev:cloud` and the tests need no database; its data is lost on restart.
//!
//! Stores never see plain passwords: the API hashes them (see `password.rs`)
//! and stores only the hash.

mod memory;
mod postgres;

use std::fmt;
use std::sync::Arc;

use async_trait::async_trait;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use nexum_schema::Mode;

pub use memory::MemoryStore;
pub use postgres::PgStore;

/// A command the mobile companion sends to the user's desktop, delivered via a
/// per-user queue that the desktop polls. Kept as an enum so future remote
/// actions (mute, next-track, …) slot in without changing the transport.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "kind", rename_all = "snake_case")]
pub enum RemoteCommand {
    /// Activate a mode by id on the desktop.
    ActivateMode { mode_id: String },
}

/// A registered account, as needed to check a login.
pub struct UserRecord {
    pub id: Uuid,
    pub pass_hash: String,
}

#[derive(Debug)]
pub enum StoreError {
    /// `create_user` with an email that already has an account.
    EmailTaken,
    /// The database failed (connection lost, bad query, …).
    Backend(String),
}

impl fmt::Display for StoreError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            StoreError::EmailTaken => f.write_str("email already registered"),
            StoreError::Backend(e) => write!(f, "storage error: {e}"),
        }
    }
}

pub type SharedStore = Arc<dyn Store>;

#[async_trait]
pub trait Store: Send + Sync {
    /// Create an account; `email` is already normalized (see `normalize_email`).
    async fn create_user(&self, email: &str, pass_hash: &str) -> Result<Uuid, StoreError>;

    async fn find_user(&self, email: &str) -> Result<Option<UserRecord>, StoreError>;

    /// This user's modes, in the order they were pushed (empty if none yet).
    async fn get_modes(&self, user_id: Uuid) -> Result<Vec<Mode>, StoreError>;

    /// Replace this user's modes (last-write-wins sync push).
    async fn put_modes(&self, user_id: Uuid, modes: Vec<Mode>) -> Result<(), StoreError>;

    /// Queue a remote command for this user's desktop to pick up.
    async fn enqueue_command(&self, user_id: Uuid, cmd: RemoteCommand) -> Result<(), StoreError>;

    /// Pop the next pending command for this user (FIFO), if any.
    async fn take_command(&self, user_id: Uuid) -> Result<Option<RemoteCommand>, StoreError>;
}

/// Emails are compared case-insensitively: `Sam@X.com` and `sam@x.com` are the
/// same account.
pub fn normalize_email(email: &str) -> String {
    email.trim().to_lowercase()
}

/// Behaviour every backend must share; run against each one in its tests.
#[cfg(test)]
pub(crate) async fn exercise(store: &dyn Store) {
    // Unique emails, so the suite can rerun against a persistent database.
    let email = format!("{}@test.nexum", Uuid::new_v4());
    let uid = store.create_user(&email, "hash-1").await.unwrap();
    assert!(matches!(
        store.create_user(&email, "hash-2").await,
        Err(StoreError::EmailTaken)
    ));
    let user = store.find_user(&email).await.unwrap().unwrap();
    assert_eq!((user.id, user.pass_hash.as_str()), (uid, "hash-1"));
    assert!(store
        .find_user("nobody@test.nexum")
        .await
        .unwrap()
        .is_none());

    // Modes: empty, then exactly what was pushed, in order; a push replaces.
    assert!(store.get_modes(uid).await.unwrap().is_empty());
    let modes: Vec<Mode> = ["Gaming", "Work", "Chill"].map(test_mode).into();
    store.put_modes(uid, modes.clone()).await.unwrap();
    let names = |m: Vec<Mode>| m.into_iter().map(|m| m.name).collect::<Vec<_>>();
    assert_eq!(
        names(store.get_modes(uid).await.unwrap()),
        ["Gaming", "Work", "Chill"]
    );
    store.put_modes(uid, vec![modes[2].clone()]).await.unwrap();
    assert_eq!(names(store.get_modes(uid).await.unwrap()), ["Chill"]);

    // Another account sees none of it.
    let other = store
        .create_user(&format!("{}@test.nexum", Uuid::new_v4()), "h")
        .await
        .unwrap();
    assert!(store.get_modes(other).await.unwrap().is_empty());

    // Command queue: FIFO, per user, drains.
    assert!(store.take_command(uid).await.unwrap().is_none());
    for id in ["one", "two"] {
        let cmd = RemoteCommand::ActivateMode { mode_id: id.into() };
        store.enqueue_command(uid, cmd).await.unwrap();
    }
    assert!(store.take_command(other).await.unwrap().is_none());
    for expected in ["one", "two"] {
        match store.take_command(uid).await.unwrap() {
            Some(RemoteCommand::ActivateMode { mode_id }) => assert_eq!(mode_id, expected),
            None => panic!("expected a command"),
        }
    }
    assert!(store.take_command(uid).await.unwrap().is_none());
}

#[cfg(test)]
fn test_mode(name: &str) -> Mode {
    serde_json::from_value(serde_json::json!({
        "id": Uuid::new_v4(),
        "name": name,
        "category": "custom",
        "steps": [],
    }))
    .expect("valid mode")
}

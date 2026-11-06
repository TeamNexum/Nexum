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
use std::time::Duration;

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

/// One client-side edit in a sync: 'base_revision' is the revision the client
/// last saw (0 for a mode it believes is new), 'mode' is None for a deletion.
#[derive(Debug, Clone, Deserialize)]
pub struct ModeChange {
    pub id: Uuid,
    pub base_revision: i64,
    #[serde(default)]
    pub mode: Option<Mode>,
}

#[derive(Debug, Clone, Serialize)]
pub struct RevisedMode {
    pub revision: i64,
    pub mode: Mode,
}

/// The account's modes after a sync, and the changes that were refused because
/// the mode moved on since `base_revision`.
#[derive(Debug, Serialize)]
pub struct SyncOutcome {
    pub modes: Vec<RevisedMode>,
    pub conflicts: Vec<Uuid>,
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

    /// Apply each change whose 'base_revision' is still current, atomically,
    /// and return the resulting state. Deleting a mode already gone is not a
    /// conflict; editing one is, since the edit would otherwise be lost.
    async fn sync_modes(
        &self,
        user_id: Uuid,
        changes: Vec<ModeChange>,
    ) -> Result<SyncOutcome, StoreError>;

    /// Queue a remote command for this user's desktop to pick up.
    async fn enqueue_command(&self, user_id: Uuid, cmd: RemoteCommand) -> Result<(), StoreError>;

    /// Pop the next pending command for this user (FIFO), if any.
    async fn take_command(&self, user_id: Uuid) -> Result<Option<RemoteCommand>, StoreError>;

    /// Start a session: store the hash of a new refresh token.
    async fn create_refresh_token(
        &self,
        user_id: Uuid,
        token_hash: &str,
        ttl: Duration,
    ) -> Result<(), StoreError>;

    /// Swap a refresh token for a new one and return its user. None if it is
    /// unknown or expired; a token already used also revokes its whole family.
    async fn rotate_refresh_token(
        &self,
        token_hash: &str,
        new_token_hash: &str,
        ttl: Duration,
    ) -> Result<Option<Uuid>, StoreError>;

    /// End a session: revoke this token's family. Unknown tokens are ignored.
    async fn revoke_refresh_token(&self, token_hash: &str) -> Result<(), StoreError>;
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

    // Modes: new ones are created, in order.
    assert!(store.get_modes(uid).await.unwrap().is_empty());
    let [gaming, work, chill] = ["Gaming", "Work", "Chill"].map(test_mode);
    let created = store
        .sync_modes(uid, vec![new(&gaming), new(&work), new(&chill)])
        .await
        .unwrap();
    assert!(created.conflicts.is_empty());
    assert_eq!(names(&created), ["Gaming", "Work", "Chill"]);
    let revision = |outcome: &SyncOutcome, id: Uuid| {
        outcome
            .modes
            .iter()
            .find(|m| m.mode.id == id)
            .map(|m| m.revision)
            .unwrap()
    };
    let gaming_rev = revision(&created, gaming.id);

    // An edit based on the latest revision applies and takes a new revision.
    let mut edited = gaming.clone();
    edited.name = "Gaming v2".into();
    let change = ModeChange {
        id: gaming.id,
        base_revision: gaming_rev,
        mode: Some(edited.clone()),
    };
    let after_edit = store.sync_modes(uid, vec![change.clone()]).await.unwrap();
    assert!(after_edit.conflicts.is_empty());
    assert_eq!(names(&after_edit), ["Gaming v2", "Work", "Chill"]);
    let new_rev = revision(&after_edit, gaming.id);
    assert!(new_rev > gaming_rev);
    assert_eq!(store.get_modes(uid).await.unwrap()[0].name, "Gaming v2");

    // The same edit from a machine still on the old revision is refused: the
    // other machine's work stays, and the rest of the batch still applies.
    let mut stale = change.clone();
    stale.mode.as_mut().unwrap().name = "Gaming stale".into();
    let mut work_edit = work.clone();
    work_edit.name = "Work v2".into();
    let outcome = store
        .sync_modes(
            uid,
            vec![
                stale,
                ModeChange {
                    id: work.id,
                    base_revision: revision(&after_edit, work.id),
                    mode: Some(work_edit),
                },
            ],
        )
        .await
        .unwrap();
    assert_eq!(outcome.conflicts, [gaming.id]);
    assert_eq!(names(&outcome), ["Gaming v2", "Work v2", "Chill"]);

    // Creating a mode that already exists is a conflict too.
    let dup = store.sync_modes(uid, vec![new(&gaming)]).await.unwrap();
    assert_eq!(dup.conflicts, [gaming.id]);

    // Deleting needs the latest revision as well.
    let stale_delete = ModeChange {
        id: gaming.id,
        base_revision: gaming_rev,
        mode: None,
    };
    let refused = store.sync_modes(uid, vec![stale_delete]).await.unwrap();
    assert_eq!(refused.conflicts, [gaming.id]);
    let deleted = store
        .sync_modes(
            uid,
            vec![ModeChange {
                id: gaming.id,
                base_revision: new_rev,
                mode: None,
            }],
        )
        .await
        .unwrap();
    assert!(deleted.conflicts.is_empty());
    assert_eq!(names(&deleted), ["Work v2", "Chill"]);

    // Already gone: deleting again is fine, editing it is a conflict.
    let again = store
        .sync_modes(
            uid,
            vec![ModeChange {
                id: gaming.id,
                base_revision: new_rev,
                mode: None,
            }],
        )
        .await
        .unwrap();
    assert!(again.conflicts.is_empty());
    let gone = store.sync_modes(uid, vec![change]).await.unwrap();
    assert_eq!(gone.conflicts, [gaming.id]);
    assert_eq!(names(&gone), ["Work v2", "Chill"]);

    // Re-created under the same id, it never reuses a revision.
    let back = store.sync_modes(uid, vec![new(&gaming)]).await.unwrap();
    assert!(back.conflicts.is_empty());
    assert!(revision(&back, gaming.id) > new_rev);

    // Another account sees none of it, and can't touch it.
    let other = store
        .create_user(&format!("{}@test.nexum", Uuid::new_v4()), "h")
        .await
        .unwrap();
    assert!(store.get_modes(other).await.unwrap().is_empty());
    let theirs = ModeChange {
        id: work.id,
        base_revision: revision(&outcome, work.id),
        mode: None,
    };
    store.sync_modes(other, vec![theirs]).await.unwrap();
    assert!(store
        .get_modes(uid)
        .await
        .unwrap()
        .iter()
        .any(|m| m.id == work.id));

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

    // Refresh tokens: rotation, expiry, reuse and revocation.
    let ttl = Duration::from_secs(60);
    let hash = |label: &str| format!("{label}-{}", Uuid::new_v4());
    let (first, second, third) = (hash("first"), hash("second"), hash("third"));
    store.create_refresh_token(uid, &first, ttl).await.unwrap();
    assert_eq!(
        store
            .rotate_refresh_token(&first, &second, ttl)
            .await
            .unwrap(),
        Some(uid)
    );
    assert_eq!(
        store
            .rotate_refresh_token(&second, &third, ttl)
            .await
            .unwrap(),
        Some(uid)
    );
    assert_eq!(
        store
            .rotate_refresh_token("unknown", &hash("x"), ttl)
            .await
            .unwrap(),
        None
    );

    // Replaying a used token kills the family, including the newest token...
    let separate = hash("other-device");
    store
        .create_refresh_token(uid, &separate, ttl)
        .await
        .unwrap();
    assert_eq!(
        store
            .rotate_refresh_token(&first, &hash("x"), ttl)
            .await
            .unwrap(),
        None
    );
    assert_eq!(
        store
            .rotate_refresh_token(&third, &hash("x"), ttl)
            .await
            .unwrap(),
        None
    );

    // ...but not another device's session, until that one signs out.
    store.revoke_refresh_token(&separate).await.unwrap();
    assert_eq!(
        store
            .rotate_refresh_token(&separate, &hash("x"), ttl)
            .await
            .unwrap(),
        None
    );
    store.revoke_refresh_token("unknown").await.unwrap();

    let expired = hash("expired");
    store
        .create_refresh_token(uid, &expired, Duration::ZERO)
        .await
        .unwrap();
    assert_eq!(
        store
            .rotate_refresh_token(&expired, &hash("x"), ttl)
            .await
            .unwrap(),
        None
    );
}

#[cfg(test)]
fn new(mode: &Mode) -> ModeChange {
    ModeChange {
        id: mode.id,
        base_revision: 0,
        mode: Some(mode.clone()),
    }
}

#[cfg(test)]
fn names(outcome: &SyncOutcome) -> Vec<&str> {
    outcome.modes.iter().map(|m| m.mode.name.as_str()).collect()
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

//! In-memory user + mode store for the cloud API.
//!
//! Skeleton for the sync backend — replace with PostgreSQL for production, and
//! replace the SHA-256 password hashing with a salted KDF (argon2/bcrypt).

use std::collections::{HashMap, VecDeque};
use std::sync::RwLock;

use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use uuid::Uuid;

use nexum_schema::Mode;

struct User {
    id: String,
    pass_hash: String,
}

/// A command the mobile companion sends to the user's desktop, delivered via a
/// per-user queue that the desktop polls. Kept as an enum so future remote
/// actions (mute, next-track, …) slot in without changing the transport.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "kind", rename_all = "snake_case")]
pub enum RemoteCommand {
    /// Activate a mode by id on the desktop.
    ActivateMode { mode_id: String },
}

#[derive(Default)]
pub struct CloudStore {
    users: RwLock<HashMap<String, User>>, // key: email
    modes: RwLock<HashMap<String, Vec<Mode>>>, // key: user id
    commands: RwLock<HashMap<String, VecDeque<RemoteCommand>>>, // key: user id
}

impl CloudStore {
    pub fn new() -> Self {
        Self::default()
    }

    /// Register a new user; returns the user id, or Err if the email is taken.
    pub fn register(&self, email: &str, password: &str) -> Result<String, ()> {
        let mut users = self.users.write().unwrap();
        if users.contains_key(email) {
            return Err(());
        }
        let id = Uuid::new_v4().to_string();
        users.insert(
            email.to_string(),
            User { id: id.clone(), pass_hash: hash(password) },
        );
        Ok(id)
    }

    /// Return the user id if the credentials match.
    pub fn authenticate(&self, email: &str, password: &str) -> Option<String> {
        let users = self.users.read().unwrap();
        let user = users.get(email)?;
        (user.pass_hash == hash(password)).then(|| user.id.clone())
    }

    /// This user's modes (empty if none synced yet).
    pub fn get_modes(&self, user_id: &str) -> Vec<Mode> {
        self.modes.read().unwrap().get(user_id).cloned().unwrap_or_default()
    }

    /// Replace this user's modes (last-write-wins sync push).
    pub fn put_modes(&self, user_id: &str, modes: Vec<Mode>) {
        self.modes.write().unwrap().insert(user_id.to_string(), modes);
    }

    /// Queue a remote command for this user's desktop to pick up.
    pub fn enqueue_command(&self, user_id: &str, cmd: RemoteCommand) {
        self.commands
            .write()
            .unwrap()
            .entry(user_id.to_string())
            .or_default()
            .push_back(cmd);
    }

    /// Pop the next pending command for this user (FIFO), if any.
    pub fn take_command(&self, user_id: &str) -> Option<RemoteCommand> {
        self.commands
            .write()
            .unwrap()
            .get_mut(user_id)
            .and_then(|q| q.pop_front())
    }
}

// NOTE: dev-only. SHA-256 without a salt is NOT secure password storage —
// swap for argon2/bcrypt with a per-user salt before any real deployment.
fn hash(password: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(password.as_bytes());
    format!("{:x}", hasher.finalize())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn register_login_and_sync() {
        let store = CloudStore::new();
        let uid = store.register("a@b.com", "pw").unwrap();
        assert!(store.register("a@b.com", "pw").is_err()); // duplicate email
        assert_eq!(store.authenticate("a@b.com", "pw").as_deref(), Some(uid.as_str()));
        assert!(store.authenticate("a@b.com", "wrong").is_none());
        assert!(store.get_modes(&uid).is_empty());
    }

    #[test]
    fn command_queue_is_fifo_and_drains() {
        let store = CloudStore::new();
        let uid = store.register("c@d.com", "pw").unwrap();
        assert!(store.take_command(&uid).is_none());
        store.enqueue_command(&uid, RemoteCommand::ActivateMode { mode_id: "one".into() });
        store.enqueue_command(&uid, RemoteCommand::ActivateMode { mode_id: "two".into() });
        match store.take_command(&uid) {
            Some(RemoteCommand::ActivateMode { mode_id }) => assert_eq!(mode_id, "one"),
            None => panic!("expected a command"),
        }
        match store.take_command(&uid) {
            Some(RemoteCommand::ActivateMode { mode_id }) => assert_eq!(mode_id, "two"),
            None => panic!("expected a command"),
        }
        assert!(store.take_command(&uid).is_none());
    }
}

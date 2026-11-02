//! In-memory store: no database needed, everything is lost on restart. Used
//! for local development and tests when `DATABASE_URL` is not set.

use std::collections::{HashMap, VecDeque};
use std::sync::atomic::{AtomicI64, Ordering};
use std::sync::RwLock;
use std::time::{Duration, Instant};

use async_trait::async_trait;
use uuid::Uuid;

use nexum_schema::Mode;

use super::{ModeChange, RemoteCommand, RevisedMode, Store, StoreError, SyncOutcome, UserRecord};

struct RefreshToken {
    family: Uuid,
    user: Uuid,
    expires_at: Instant,
    used: bool,
}

#[derive(Default)]
pub struct MemoryStore {
    users: RwLock<HashMap<String, UserRecord>>, // key: email
    modes: RwLock<HashMap<Uuid, Vec<RevisedMode>>>,
    last_revision: AtomicI64,
    commands: RwLock<HashMap<Uuid, VecDeque<RemoteCommand>>>,
    refresh_tokens: RwLock<HashMap<String, RefreshToken>>, // key: token hash
}

impl MemoryStore {
    pub fn new() -> Self {
        Self::default()
    }

    fn next_revision(&self) -> i64 {
        self.last_revision.fetch_add(1, Ordering::Relaxed) + 1
    }
}

#[async_trait]
impl Store for MemoryStore {
    async fn create_user(&self, email: &str, pass_hash: &str) -> Result<Uuid, StoreError> {
        let mut users = self.users.write().unwrap();
        if users.contains_key(email) {
            return Err(StoreError::EmailTaken);
        }
        let id = Uuid::new_v4();
        users.insert(
            email.to_string(),
            UserRecord {
                id,
                pass_hash: pass_hash.to_string(),
            },
        );
        Ok(id)
    }

    async fn find_user(&self, email: &str) -> Result<Option<UserRecord>, StoreError> {
        Ok(self.users.read().unwrap().get(email).map(|u| UserRecord {
            id: u.id,
            pass_hash: u.pass_hash.clone(),
        }))
    }

    async fn get_modes(&self, user_id: Uuid) -> Result<Vec<Mode>, StoreError> {
        Ok(self
            .modes
            .read()
            .unwrap()
            .get(&user_id)
            .map(|modes| modes.iter().map(|m| m.mode.clone()).collect())
            .unwrap_or_default())
    }

    async fn sync_modes(
        &self,
        user_id: Uuid,
        changes: Vec<ModeChange>,
    ) -> Result<SyncOutcome, StoreError> {
        let mut all = self.modes.write().unwrap();
        let modes = all.entry(user_id).or_default();
        let mut conflicts = Vec::new();
        for change in changes {
            let found = modes.iter().position(|m| m.mode.id == change.id);
            let current = found.map(|i| modes[i].revision);
            let up_to_date = current.unwrap_or(0) == change.base_revision;
            match (change.mode, found) {
                (Some(mode), _) if up_to_date => {
                    let revision = self.next_revision();
                    match found {
                        Some(i) => modes[i] = RevisedMode { revision, mode },
                        None => modes.push(RevisedMode { revision, mode }),
                    }
                }
                (None, Some(i)) if up_to_date => {
                    modes.remove(i);
                }
                (None, None) => {}
                _ => conflicts.push(change.id),
            }
        }
        Ok(SyncOutcome {
            modes: modes.clone(),
            conflicts,
        })
    }

    async fn enqueue_command(&self, user_id: Uuid, cmd: RemoteCommand) -> Result<(), StoreError> {
        self.commands
            .write()
            .unwrap()
            .entry(user_id)
            .or_default()
            .push_back(cmd);
        Ok(())
    }

    async fn take_command(&self, user_id: Uuid) -> Result<Option<RemoteCommand>, StoreError> {
        Ok(self
            .commands
            .write()
            .unwrap()
            .get_mut(&user_id)
            .and_then(|q| q.pop_front()))
    }

    async fn create_refresh_token(
        &self,
        user_id: Uuid,
        token_hash: &str,
        ttl: Duration,
    ) -> Result<(), StoreError> {
        self.refresh_tokens.write().unwrap().insert(
            token_hash.to_string(),
            RefreshToken {
                family: Uuid::new_v4(),
                user: user_id,
                expires_at: Instant::now() + ttl,
                used: false,
            },
        );
        Ok(())
    }

    async fn rotate_refresh_token(
        &self,
        token_hash: &str,
        new_token_hash: &str,
        ttl: Duration,
    ) -> Result<Option<Uuid>, StoreError> {
        let mut tokens = self.refresh_tokens.write().unwrap();
        let Some(token) = tokens.get_mut(token_hash) else {
            return Ok(None);
        };
        let (family, user) = (token.family, token.user);
        if token.used {
            tokens.retain(|_, t| t.family != family);
            return Ok(None);
        }
        if token.expires_at <= Instant::now() {
            return Ok(None);
        }
        token.used = true;
        tokens.insert(
            new_token_hash.to_string(),
            RefreshToken {
                family,
                user,
                expires_at: Instant::now() + ttl,
                used: false,
            },
        );
        Ok(Some(user))
    }

    async fn revoke_refresh_token(&self, token_hash: &str) -> Result<(), StoreError> {
        let mut tokens = self.refresh_tokens.write().unwrap();
        if let Some(family) = tokens.get(token_hash).map(|t| t.family) {
            tokens.retain(|_, t| t.family != family);
        }
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn behaves_like_a_store() {
        super::super::exercise(&MemoryStore::new()).await;
    }
}

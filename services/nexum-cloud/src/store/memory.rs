//! In-memory store: no database needed, everything is lost on restart. Used
//! for local development and tests when `DATABASE_URL` is not set.

use std::collections::{HashMap, VecDeque};
use std::sync::RwLock;

use async_trait::async_trait;
use uuid::Uuid;

use nexum_schema::Mode;

use super::{RemoteCommand, Store, StoreError, UserRecord};

#[derive(Default)]
pub struct MemoryStore {
    users: RwLock<HashMap<String, UserRecord>>, // key: email
    modes: RwLock<HashMap<Uuid, Vec<Mode>>>,
    commands: RwLock<HashMap<Uuid, VecDeque<RemoteCommand>>>,
}

impl MemoryStore {
    pub fn new() -> Self {
        Self::default()
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
            .cloned()
            .unwrap_or_default())
    }

    async fn put_modes(&self, user_id: Uuid, modes: Vec<Mode>) -> Result<(), StoreError> {
        self.modes.write().unwrap().insert(user_id, modes);
        Ok(())
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
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn behaves_like_a_store() {
        super::super::exercise(&MemoryStore::new()).await;
    }
}

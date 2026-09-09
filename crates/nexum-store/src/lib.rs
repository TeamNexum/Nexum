//! # nexum-store
//!
//! Persistence abstraction for modes. [`ModeStore`] keeps the app
//! storage-agnostic. [`InMemoryStore`] is always available (tests, early dev).
//! [`SqliteStore`] (behind the `sqlite` feature) is the offline-first store; the
//! cloud Sync Manager will sit behind this same trait.

use std::collections::HashMap;
use std::sync::Mutex;

use async_trait::async_trait;
use thiserror::Error;
use uuid::Uuid;

use nexum_schema::Mode;

#[derive(Debug, Error)]
pub enum StoreError {
    #[error("mode not found: {0}")]
    NotFound(Uuid),
    #[error("storage backend error: {0}")]
    Backend(String),
}

#[async_trait]
pub trait ModeStore: Send + Sync {
    async fn list(&self) -> Result<Vec<Mode>, StoreError>;
    async fn get(&self, id: Uuid) -> Result<Mode, StoreError>;
    async fn upsert(&self, mode: Mode) -> Result<(), StoreError>;
    async fn delete(&self, id: Uuid) -> Result<(), StoreError>;
}

/// Thread-safe in-memory store. Not persistent — for tests and early dev.
#[derive(Default)]
pub struct InMemoryStore {
    modes: Mutex<HashMap<Uuid, Mode>>,
}

impl InMemoryStore {
    pub fn new() -> Self {
        Self::default()
    }
}

#[async_trait]
impl ModeStore for InMemoryStore {
    async fn list(&self) -> Result<Vec<Mode>, StoreError> {
        Ok(self.modes.lock().unwrap().values().cloned().collect())
    }

    async fn get(&self, id: Uuid) -> Result<Mode, StoreError> {
        self.modes
            .lock()
            .unwrap()
            .get(&id)
            .cloned()
            .ok_or(StoreError::NotFound(id))
    }

    async fn upsert(&self, mode: Mode) -> Result<(), StoreError> {
        self.modes.lock().unwrap().insert(mode.id, mode);
        Ok(())
    }

    async fn delete(&self, id: Uuid) -> Result<(), StoreError> {
        self.modes.lock().unwrap().remove(&id);
        Ok(())
    }
}

// ---- SQLite (offline-first) -----------------------------------------------

#[cfg(feature = "sqlite")]
mod sqlite {
    use super::*;
    use rusqlite::{Connection, OptionalExtension};

    /// SQLite-backed store. Modes are stored as JSON keyed by id — simple,
    /// robust, and enough for the offline-first cache. Normalized tables can
    /// come later if we need to query inside modes.
    pub struct SqliteStore {
        conn: Mutex<Connection>,
    }

    impl SqliteStore {
        pub fn open(path: &str) -> Result<Self, StoreError> {
            let conn = Connection::open(path).map_err(be)?;
            conn.execute(
                "CREATE TABLE IF NOT EXISTS modes (id TEXT PRIMARY KEY, data TEXT NOT NULL)",
                [],
            )
            .map_err(be)?;
            Ok(Self { conn: Mutex::new(conn) })
        }

        pub fn in_memory() -> Result<Self, StoreError> {
            Self::open(":memory:")
        }
    }

    #[async_trait]
    impl ModeStore for SqliteStore {
        async fn list(&self) -> Result<Vec<Mode>, StoreError> {
            let conn = self.conn.lock().unwrap();
            let mut stmt = conn.prepare("SELECT data FROM modes").map_err(be)?;
            let rows = stmt
                .query_map([], |row| row.get::<_, String>(0))
                .map_err(be)?;
            let mut modes = Vec::new();
            for row in rows {
                let data = row.map_err(be)?;
                modes.push(serde_json::from_str::<Mode>(&data).map_err(je)?);
            }
            Ok(modes)
        }

        async fn get(&self, id: Uuid) -> Result<Mode, StoreError> {
            let conn = self.conn.lock().unwrap();
            let data: Option<String> = conn
                .query_row(
                    "SELECT data FROM modes WHERE id = ?1",
                    [id.to_string()],
                    |row| row.get(0),
                )
                .optional()
                .map_err(be)?;
            match data {
                Some(d) => serde_json::from_str::<Mode>(&d).map_err(je),
                None => Err(StoreError::NotFound(id)),
            }
        }

        async fn upsert(&self, mode: Mode) -> Result<(), StoreError> {
            let conn = self.conn.lock().unwrap();
            let data = serde_json::to_string(&mode).map_err(je)?;
            conn.execute(
                "INSERT INTO modes (id, data) VALUES (?1, ?2)
                 ON CONFLICT(id) DO UPDATE SET data = ?2",
                rusqlite::params![mode.id.to_string(), data],
            )
            .map_err(be)?;
            Ok(())
        }

        async fn delete(&self, id: Uuid) -> Result<(), StoreError> {
            let conn = self.conn.lock().unwrap();
            conn.execute("DELETE FROM modes WHERE id = ?1", [id.to_string()])
                .map_err(be)?;
            Ok(())
        }
    }

    fn be(e: rusqlite::Error) -> StoreError {
        StoreError::Backend(e.to_string())
    }
    fn je(e: serde_json::Error) -> StoreError {
        StoreError::Backend(e.to_string())
    }
}

#[cfg(feature = "sqlite")]
pub use sqlite::SqliteStore;

#[cfg(test)]
mod tests {
    use super::*;
    use nexum_schema::{Category, Mode};

    fn sample(id: Uuid) -> Mode {
        Mode {
            id,
            name: "m".into(),
            description: None,
            category: Category::Custom,
            steps: vec![],
        }
    }

    #[tokio::test]
    async fn in_memory_crud() {
        let store = InMemoryStore::new();
        let id = Uuid::from_u128(1);
        store.upsert(sample(id)).await.unwrap();
        assert_eq!(store.get(id).await.unwrap().id, id);
        assert_eq!(store.list().await.unwrap().len(), 1);
        store.delete(id).await.unwrap();
        assert!(store.get(id).await.is_err());
    }

    #[cfg(feature = "sqlite")]
    #[tokio::test]
    async fn sqlite_crud() {
        let store = SqliteStore::in_memory().unwrap();
        let id = Uuid::from_u128(42);
        store.upsert(sample(id)).await.unwrap();
        assert_eq!(store.get(id).await.unwrap().id, id);
        assert_eq!(store.list().await.unwrap().len(), 1);
        store.delete(id).await.unwrap();
        assert!(store.get(id).await.is_err());
    }
}

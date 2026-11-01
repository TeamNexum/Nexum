//! PostgreSQL store. The schema lives in `migrations/` and is applied at
//! startup by [`PgStore::connect`].

use std::str::FromStr;

use async_trait::async_trait;
use deadpool_postgres::{Manager, ManagerConfig, Pool, RecyclingMethod};
use tokio_postgres::error::SqlState;
use tokio_postgres::types::Json;
use tokio_postgres::NoTls;
use uuid::Uuid;

use nexum_schema::Mode;

use super::{RemoteCommand, Store, StoreError, UserRecord};

/// Applied in order, each once, recorded in `schema_migrations`. Never edit a
/// migration that has shipped: add a new one.
const MIGRATIONS: &[(i32, &str)] = &[(1, include_str!("../../migrations/0001_init.sql"))];

/// Any constant shared by every instance, so two servers starting at once
/// don't both migrate.
const MIGRATION_LOCK: i64 = 0x006e_6578_756d; // "nexum" in ASCII

const POOL_SIZE: usize = 16;

pub struct PgStore {
    pool: Pool,
}

impl From<tokio_postgres::Error> for StoreError {
    fn from(e: tokio_postgres::Error) -> Self {
        StoreError::Backend(e.to_string())
    }
}

impl From<deadpool_postgres::PoolError> for StoreError {
    fn from(e: deadpool_postgres::PoolError) -> Self {
        StoreError::Backend(e.to_string())
    }
}

impl PgStore {
    /// Connect to 'url' (e.g. 'postgres://user:pass@host:5432/db') and bring
    /// the schema up to date.
    ///
    /// No TLS: the database is reached over the private Docker network. A
    /// managed database outside it would need a TLS connector here.
    pub async fn connect(url: &str) -> Result<Self, StoreError> {
        let config = tokio_postgres::Config::from_str(url)?;
        let manager = Manager::from_config(
            config,
            NoTls,
            ManagerConfig {
                recycling_method: RecyclingMethod::Fast,
            },
        );
        let pool = Pool::builder(manager)
            .max_size(POOL_SIZE)
            .build()
            .map_err(|e| StoreError::Backend(e.to_string()))?;
        let store = Self { pool };
        store.migrate().await?;
        Ok(store)
    }

    async fn migrate(&self) -> Result<(), StoreError> {
        let mut client = self.pool.get().await?;
        let tx = client.transaction().await?;
        tx.execute("SELECT pg_advisory_xact_lock($1)", &[&MIGRATION_LOCK])
            .await?;
        tx.batch_execute(
            "CREATE TABLE IF NOT EXISTS schema_migrations (
                version     INT PRIMARY KEY,
                applied_at  TIMESTAMPTZ NOT NULL DEFAULT now()
            )",
        )
        .await?;
        let applied: Vec<i32> = tx
            .query("SELECT version FROM schema_migrations", &[])
            .await?
            .iter()
            .map(|row| row.get(0))
            .collect();
        for (version, sql) in MIGRATIONS {
            if applied.contains(version) {
                continue;
            }
            tx.batch_execute(sql).await?;
            tx.execute(
                "INSERT INTO schema_migrations (version) VALUES ($1)",
                &[version],
            )
            .await?;
            println!("database: applied migration {version}");
        }
        tx.commit().await?;
        Ok(())
    }
}

#[async_trait]
impl Store for PgStore {
    async fn create_user(&self, email: &str, pass_hash: &str) -> Result<Uuid, StoreError> {
        let id = Uuid::new_v4();
        let client = self.pool.get().await?;
        match client
            .execute(
                "INSERT INTO users (id, email, pass_hash) VALUES ($1, $2, $3)",
                &[&id, &email, &pass_hash],
            )
            .await
        {
            Ok(_) => Ok(id),
            Err(e) if e.code() == Some(&SqlState::UNIQUE_VIOLATION) => Err(StoreError::EmailTaken),
            Err(e) => Err(e.into()),
        }
    }

    async fn find_user(&self, email: &str) -> Result<Option<UserRecord>, StoreError> {
        let client = self.pool.get().await?;
        let row = client
            .query_opt(
                "SELECT id, pass_hash FROM users WHERE email = $1",
                &[&email],
            )
            .await?;
        Ok(row.map(|row| UserRecord {
            id: row.get(0),
            pass_hash: row.get(1),
        }))
    }

    async fn get_modes(&self, user_id: Uuid) -> Result<Vec<Mode>, StoreError> {
        let client = self.pool.get().await?;
        let rows = client
            .query(
                "SELECT data FROM modes WHERE user_id = $1 ORDER BY position",
                &[&user_id],
            )
            .await?;
        Ok(rows
            .iter()
            .map(|row| row.get::<_, Json<Mode>>(0).0)
            .collect())
    }

    async fn put_modes(&self, user_id: Uuid, modes: Vec<Mode>) -> Result<(), StoreError> {
        let mut client = self.pool.get().await?;
        let tx = client.transaction().await?;
        tx.execute("DELETE FROM modes WHERE user_id = $1", &[&user_id])
            .await?;
        let insert = tx
            .prepare(
                "INSERT INTO modes (user_id, mode_id, position, data)
                 VALUES ($1, $2, $3, $4)
                 ON CONFLICT (user_id, mode_id)
                 DO UPDATE SET position = EXCLUDED.position, data = EXCLUDED.data",
            )
            .await?;
        // A mode id sent twice keeps its last copy, as with the in-memory store.
        for (position, mode) in modes.iter().enumerate() {
            let position = position as i32;
            tx.execute(&insert, &[&user_id, &mode.id, &position, &Json(mode)])
                .await?;
        }
        tx.commit().await?;
        Ok(())
    }

    async fn enqueue_command(&self, user_id: Uuid, cmd: RemoteCommand) -> Result<(), StoreError> {
        let client = self.pool.get().await?;
        client
            .execute(
                "INSERT INTO commands (user_id, payload) VALUES ($1, $2)",
                &[&user_id, &Json(&cmd)],
            )
            .await?;
        Ok(())
    }

    async fn take_command(&self, user_id: Uuid) -> Result<Option<RemoteCommand>, StoreError> {
        let client = self.pool.get().await?;
        // SKIP LOCKED: two pollers never get the same command.
        let row = client
            .query_opt(
                "DELETE FROM commands WHERE id = (
                    SELECT id FROM commands WHERE user_id = $1
                    ORDER BY id LIMIT 1
                    FOR UPDATE SKIP LOCKED
                 ) RETURNING payload",
                &[&user_id],
            )
            .await?;
        Ok(row.map(|row| row.get::<_, Json<RemoteCommand>>(0).0))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    /// Runs only when `NEXUM_TEST_DATABASE_URL` points at a disposable
    /// PostgreSQL (CI starts one); skipped otherwise.
    #[tokio::test]
    async fn behaves_like_a_store() {
        let Ok(url) = std::env::var("NEXUM_TEST_DATABASE_URL") else {
            eprintln!("NEXUM_TEST_DATABASE_URL not set: skipping the PostgreSQL store test");
            return;
        };
        let store = PgStore::connect(&url).await.expect("connect");
        // Migrating an up-to-date database is a no-op.
        store.migrate().await.expect("second migration run");
        super::super::exercise(&store).await;
    }
}

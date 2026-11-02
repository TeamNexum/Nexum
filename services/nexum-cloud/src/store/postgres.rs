//! PostgreSQL store. The schema lives in `migrations/` and is applied at
//! startup by [`PgStore::connect`].

use std::str::FromStr;
use std::time::Duration;

use async_trait::async_trait;
use deadpool_postgres::{Manager, ManagerConfig, Pool, RecyclingMethod};
use tokio_postgres::error::SqlState;
use tokio_postgres::types::Json;
use tokio_postgres::NoTls;
use uuid::Uuid;

use nexum_schema::Mode;

use super::{ModeChange, RemoteCommand, RevisedMode, Store, StoreError, SyncOutcome, UserRecord};

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
                "SELECT data FROM modes WHERE user_id = $1 ORDER BY position, mode_id",
                &[&user_id],
            )
            .await?;
        rows.iter()
            .map(|row| Ok(row.try_get::<_, Json<Mode>>(0)?.0))
            .collect()
    }

    async fn sync_modes(
        &self,
        user_id: Uuid,
        changes: Vec<ModeChange>,
    ) -> Result<SyncOutcome, StoreError> {
        let mut client = self.pool.get().await?;
        let tx = client.transaction().await?;
        let mut conflicts = Vec::new();
        for change in changes {
            let applied = match &change.mode {
                Some(mode) if change.base_revision == 0 => {
                    tx.execute(
                        "INSERT INTO modes (user_id, mode_id, position, data)
                         VALUES ($1, $2,
                            (SELECT COALESCE(MAX(position), -1) + 1 FROM modes WHERE user_id = $1),
                            $3)
                         ON CONFLICT (user_id, mode_id) DO NOTHING",
                        &[&user_id, &change.id, &Json(mode)],
                    )
                    .await?
                }
                Some(mode) => {
                    tx.execute(
                        "UPDATE modes
                         SET data = $4, revision = nextval('mode_revisions'), updated_at = now()
                         WHERE user_id = $1 AND mode_id = $2 AND revision = $3",
                        &[&user_id, &change.id, &change.base_revision, &Json(mode)],
                    )
                    .await?
                }
                None => {
                    let deleted = tx
                        .execute(
                            "DELETE FROM modes
                             WHERE user_id = $1 AND mode_id = $2 AND revision = $3",
                            &[&user_id, &change.id, &change.base_revision],
                        )
                        .await?;
                    // Nothing deleted is only a conflict if the mode still exists.
                    let exists = tx
                        .query_opt(
                            "SELECT 1 FROM modes WHERE user_id = $1 AND mode_id = $2",
                            &[&user_id, &change.id],
                        )
                        .await?
                        .is_some();
                    deleted + u64::from(!exists)
                }
            };
            if applied == 0 {
                conflicts.push(change.id);
            }
        }
        let rows = tx
            .query(
                "SELECT revision, data FROM modes WHERE user_id = $1 ORDER BY position, mode_id",
                &[&user_id],
            )
            .await?;
        let modes = rows
            .iter()
            .map(|row| {
                Ok(RevisedMode {
                    revision: row.try_get(0)?,
                    mode: row.try_get::<_, Json<Mode>>(1)?.0,
                })
            })
            .collect::<Result<_, StoreError>>()?;
        tx.commit().await?;
        Ok(SyncOutcome { modes, conflicts })
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
        Ok(row
            .map(|row| row.try_get::<_, Json<RemoteCommand>>(0))
            .transpose()?
            .map(|payload| payload.0))
    }

    async fn create_refresh_token(
        &self,
        user_id: Uuid,
        token_hash: &str,
        ttl: Duration,
    ) -> Result<(), StoreError> {
        let client = self.pool.get().await?;
        // Each sign-in is a chance to clear this user's dead tokens.
        client
            .execute(
                "DELETE FROM refresh_tokens WHERE user_id = $1 AND expires_at <= now()",
                &[&user_id],
            )
            .await?;
        client
            .execute(
                "INSERT INTO refresh_tokens (token_hash, family_id, user_id, expires_at)
                 VALUES ($1, $2, $3, now() + make_interval(secs => $4))",
                &[&token_hash, &Uuid::new_v4(), &user_id, &ttl.as_secs_f64()],
            )
            .await?;
        Ok(())
    }

    async fn rotate_refresh_token(
        &self,
        token_hash: &str,
        new_token_hash: &str,
        ttl: Duration,
    ) -> Result<Option<Uuid>, StoreError> {
        let mut client = self.pool.get().await?;
        let tx = client.transaction().await?;
        // FOR UPDATE: of two simultaneous uses, the second sees the first's mark.
        let Some(row) = tx
            .query_opt(
                "SELECT family_id, user_id, used_at IS NOT NULL, expires_at <= now()
                 FROM refresh_tokens WHERE token_hash = $1 FOR UPDATE",
                &[&token_hash],
            )
            .await?
        else {
            return Ok(None);
        };
        let (family, user): (Uuid, Uuid) = (row.try_get(0)?, row.try_get(1)?);
        let (used, expired): (bool, bool) = (row.try_get(2)?, row.try_get(3)?);
        if used {
            tx.execute(
                "DELETE FROM refresh_tokens WHERE family_id = $1",
                &[&family],
            )
            .await?;
            tx.commit().await?;
            return Ok(None);
        }
        if expired {
            return Ok(None);
        }
        tx.execute(
            "UPDATE refresh_tokens SET used_at = now() WHERE token_hash = $1",
            &[&token_hash],
        )
        .await?;
        tx.execute(
            "INSERT INTO refresh_tokens (token_hash, family_id, user_id, expires_at)
             VALUES ($1, $2, $3, now() + make_interval(secs => $4))",
            &[&new_token_hash, &family, &user, &ttl.as_secs_f64()],
        )
        .await?;
        tx.commit().await?;
        Ok(Some(user))
    }

    async fn revoke_refresh_token(&self, token_hash: &str) -> Result<(), StoreError> {
        let client = self.pool.get().await?;
        client
            .execute(
                "DELETE FROM refresh_tokens WHERE family_id = (
                    SELECT family_id FROM refresh_tokens WHERE token_hash = $1
                 )",
                &[&token_hash],
            )
            .await?;
        Ok(())
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

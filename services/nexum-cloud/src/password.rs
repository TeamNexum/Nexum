//! Password hashing with Argon2id (random salt per password, PHC string
//! format, so the parameters travel with the hash).
//!
//! Hashing is deliberately slow (tens of milliseconds), so it runs on the
//! blocking thread pool instead of stalling the async runtime.

use argon2::password_hash::rand_core::OsRng;
use argon2::password_hash::{PasswordHash, PasswordHasher, PasswordVerifier, SaltString};
use argon2::Argon2;

pub const MIN_LENGTH: usize = 8;

pub async fn hash(password: String) -> String {
    tokio::task::spawn_blocking(move || {
        let salt = SaltString::generate(&mut OsRng);
        Argon2::default()
            .hash_password(password.as_bytes(), &salt)
            .expect("argon2 hashing with default parameters")
            .to_string()
    })
    .await
    .expect("password hashing task")
}

/// False for a wrong password and for a malformed hash.
pub async fn verify(password: String, hash: String) -> bool {
    tokio::task::spawn_blocking(move || {
        PasswordHash::new(&hash).is_ok_and(|parsed| {
            Argon2::default()
                .verify_password(password.as_bytes(), &parsed)
                .is_ok()
        })
    })
    .await
    .unwrap_or(false)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn hashes_are_salted_and_verify() {
        let first = hash("correct horse".into()).await;
        let second = hash("correct horse".into()).await;
        assert!(first.starts_with("$argon2id$"), "{first}");
        assert_ne!(first, second, "same password must not give the same hash");
        assert!(verify("correct horse".into(), first.clone()).await);
        assert!(!verify("wrong horse".into(), first).await);
        assert!(!verify("correct horse".into(), "not-a-hash".into()).await);
    }
}

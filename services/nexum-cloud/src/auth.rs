//! Sessions for the cloud API: a short-lived JWT access token, renewed with a
//! long-lived opaque refresh token. Secret from `NEXUM_JWT_SECRET`, read once at
//! startup by [`init_secret`].
//!
//! A JWT can't be revoked, so it only lives for minutes; the refresh token is
//! checked against the database, rotated on each use, and revoked on sign-out.

use std::sync::OnceLock;
use std::time::Duration;

use argon2::password_hash::rand_core::{OsRng, RngCore};
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};

const ACCESS_TOKEN_SECS: usize = 15 * 60;
/// Sliding: each refresh starts a new period, so only an unused device expires.
pub const REFRESH_TOKEN_TTL: Duration = Duration::from_secs(60 * 60 * 24 * 60);

#[derive(Serialize, Deserialize)]
struct Claims {
    sub: String, // user id
    exp: usize,  // expiry (unix seconds)
}

const MIN_SECRET_LEN: usize = 32;
const DEV_SECRET: &str = "dev-secret-change-me";

static SECRET: OnceLock<Vec<u8>> = OnceLock::new();

pub fn init_secret(allow_dev_secret: bool) -> Result<(), String> {
    let secret = match std::env::var("NEXUM_JWT_SECRET") {
        Ok(secret) if secret.len() >= MIN_SECRET_LEN => secret,
        Ok(_) => {
            return Err(format!(
                "NEXUM_JWT_SECRET must be at least {MIN_SECRET_LEN} characters (try: openssl rand -base64 48)"
            ))
        }
        Err(_) if allow_dev_secret => {
            println!("NEXUM_JWT_SECRET is not set: signing tokens with the public dev secret");
            DEV_SECRET.to_string()
        }
        Err(_) => return Err("NEXUM_JWT_SECRET is required when DATABASE_URL is set".into()),
    };
    let _ = SECRET.set(secret.into_bytes());
    Ok(())
}

fn secret() -> &'static [u8] {
    SECRET.get().map_or(DEV_SECRET.as_bytes(), Vec::as_slice)
}

fn now_secs() -> usize {
    use std::time::{SystemTime, UNIX_EPOCH};
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_secs() as usize)
        .unwrap_or(0)
}

/// Issue a signed access token for a user id.
pub fn issue_token(user_id: &str) -> String {
    let claims = Claims {
        sub: user_id.to_string(),
        exp: now_secs() + ACCESS_TOKEN_SECS,
    };
    encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(secret()),
    )
    .expect("jwt encode should not fail")
}

/// Verify a token and return the user id, or None if invalid/expired.
pub fn verify_token(token: &str) -> Option<String> {
    let mut validation = Validation::default();
    validation.validate_aud = false;
    decode::<Claims>(token, &DecodingKey::from_secret(secret()), &validation)
        .ok()
        .map(|data| data.claims.sub)
}

/// A new refresh token for the client, with the hash the server stores.
pub fn new_refresh_token() -> (String, String) {
    let mut bytes = [0u8; 32];
    OsRng.fill_bytes(&mut bytes);
    let token: String = bytes.iter().map(|b| format!("{b:02x}")).collect();
    let hash = hash_refresh_token(&token);
    (token, hash)
}

/// Plain SHA-256 is enough here, unlike for passwords: the input is 256 random
/// bits, so there is nothing to guess.
pub fn hash_refresh_token(token: &str) -> String {
    format!("{:x}", Sha256::digest(token.as_bytes()))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn token_roundtrip() {
        let token = issue_token("user-123");
        assert_eq!(verify_token(&token).as_deref(), Some("user-123"));
    }

    #[test]
    fn garbage_token_is_rejected() {
        assert!(verify_token("not-a-jwt").is_none());
    }
}

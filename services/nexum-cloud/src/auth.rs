//! JWT issue/verify for the cloud API. Secret from `NEXUM_JWT_SECRET`, read
//! once at startup by [`init_secret`]. Tokens are valid for 30 days.

use std::sync::OnceLock;

use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};

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

/// Issue a signed token for a user id (30-day expiry).
pub fn issue_token(user_id: &str) -> String {
    let claims = Claims {
        sub: user_id.to_string(),
        exp: now_secs() + 60 * 60 * 24 * 30,
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

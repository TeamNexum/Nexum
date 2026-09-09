//! JWT issue/verify for the cloud API. Secret from `NEXUM_JWT_SECRET`
//! (falls back to a dev secret). Tokens are valid for 30 days.

use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
struct Claims {
    sub: String, // user id
    exp: usize,  // expiry (unix seconds)
}

fn secret() -> Vec<u8> {
    std::env::var("NEXUM_JWT_SECRET")
        .unwrap_or_else(|_| "dev-secret-change-me".to_string())
        .into_bytes()
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
    encode(&Header::default(), &claims, &EncodingKey::from_secret(&secret()))
        .expect("jwt encode should not fail")
}

/// Verify a token and return the user id, or None if invalid/expired.
pub fn verify_token(token: &str) -> Option<String> {
    let mut validation = Validation::default();
    validation.validate_aud = false;
    decode::<Claims>(token, &DecodingKey::from_secret(&secret()), &validation)
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

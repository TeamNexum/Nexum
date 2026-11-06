//! The cloud refresh token, kept in the OS keychain (macOS Keychain, Windows
//! Credential Manager, Linux Secret Service) rather than in the webview's
//! localStorage, which is a plain file on disk.

use keyring::Entry;

const SERVICE: &str = "app.nexum.desktop";
const ACCOUNT: &str = "cloud-refresh-token";

fn entry(service: &str) -> keyring::Result<Entry> {
    Entry::new(service, ACCOUNT)
}

fn load(service: &str) -> keyring::Result<Option<String>> {
    match entry(service)?.get_password() {
        Ok(token) => Ok(Some(token)),
        Err(keyring::Error::NoEntry) => Ok(None),
        Err(e) => Err(e),
    }
}

fn clear(service: &str) -> keyring::Result<()> {
    match entry(service)?.delete_credential() {
        Ok(()) | Err(keyring::Error::NoEntry) => Ok(()),
        Err(e) => Err(e),
    }
}

/// Keychain calls can block (e.g. on an unlock prompt), so they stay off the
/// async runtime.
async fn blocking<T: Send + 'static>(
    call: impl FnOnce() -> keyring::Result<T> + Send + 'static,
) -> Result<T, String> {
    tauri::async_runtime::spawn_blocking(call)
        .await
        .map_err(|e| e.to_string())?
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn load_cloud_token() -> Result<Option<String>, String> {
    blocking(|| load(SERVICE)).await
}

#[tauri::command]
pub async fn save_cloud_token(token: String) -> Result<(), String> {
    blocking(move || entry(SERVICE)?.set_password(&token)).await
}

#[tauri::command]
pub async fn clear_cloud_token() -> Result<(), String> {
    blocking(|| clear(SERVICE)).await
}

#[cfg(test)]
mod tests {
    use super::*;

    /// Talks to the real keychain, which CI machines don't have. Run with:
    /// cargo test --manifest-path apps/desktop/src-tauri/Cargo.toml keychain -- --ignored
    #[test]
    #[ignore]
    fn keychain_roundtrip() {
        let service = "app.nexum.desktop.test";
        clear(service).unwrap();
        assert_eq!(load(service).unwrap(), None);
        entry(service).unwrap().set_password("first").unwrap();
        entry(service).unwrap().set_password("second").unwrap();
        assert_eq!(load(service).unwrap().as_deref(), Some("second"));
        clear(service).unwrap();
        clear(service).unwrap(); // already gone: not an error
        assert_eq!(load(service).unwrap(), None);
    }
}

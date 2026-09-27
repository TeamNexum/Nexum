use async_trait::async_trait;

use nexum_core::{ActionOutcome, Adapter, AdapterError, Capability};
use nexum_schema::action_types::{ids, SetVolumeParams};
use nexum_schema::ActionStep;

use crate::util::{deser, ok};

/// Set the global output volume.
pub struct AudioAdapter;

impl AudioAdapter {
    /// Read the default endpoint without changing its volume or mute state.
    pub fn probe() -> Result<(), AdapterError> {
        #[cfg(target_os = "windows")]
        {
            probe_windows_audio()
        }
        #[cfg(target_os = "macos")]
        {
            probe_macos_audio()
        }
        #[cfg(not(any(target_os = "windows", target_os = "macos")))]
        {
            Err(AdapterError::Unavailable(
                "Diagnostic audio disponible uniquement sur Windows et macOS".into(),
            ))
        }
    }

    pub fn new() -> Self {
        Self
    }
}

impl Default for AudioAdapter {
    fn default() -> Self {
        Self::new()
    }
}

#[async_trait]
impl Adapter for AudioAdapter {
    fn supported_actions(&self) -> Vec<String> {
        vec![ids::AUDIO_SET_VOLUME.into()]
    }

    async fn is_available(&self) -> Capability {
        if cfg!(any(
            target_os = "linux",
            target_os = "windows",
            target_os = "macos"
        )) {
            Capability::Available
        } else {
            Capability::Unavailable {
                reason: "volume control not yet implemented on this OS".into(),
            }
        }
    }

    fn validate(&self, step: &ActionStep) -> Result<(), AdapterError> {
        let p: SetVolumeParams = deser(step)?;
        if p.percent > 100 {
            return Err(AdapterError::InvalidParams {
                action_type: step.action_type.clone(),
                reason: "percent must be between 0 and 100".into(),
            });
        }
        Ok(())
    }

    async fn execute(&self, step: &ActionStep) -> Result<ActionOutcome, AdapterError> {
        self.validate(step)?;
        let p: SetVolumeParams = deser(step)?;
        set_volume(p.percent)?;
        Ok(ok(step, format!("volume set to {}%", p.percent)))
    }
}

#[cfg(any(target_os = "linux", target_os = "macos"))]
fn try_run(cmd: &str, args: &[&str]) -> bool {
    std::process::Command::new(cmd)
        .args(args)
        .status()
        .map(|s| s.success())
        .unwrap_or(false)
}

fn set_volume(percent: u8) -> Result<(), AdapterError> {
    #[cfg(target_os = "linux")]
    {
        // Fedora defaults to PipeWire, so try its native `wpctl` first (unmute
        // then set), and fall back to `pactl` (PulseAudio / pipewire-pulse).
        let frac = format!("{:.2}", percent as f32 / 100.0);
        if try_run("wpctl", &["set-mute", "@DEFAULT_AUDIO_SINK@", "0"])
            && try_run("wpctl", &["set-volume", "@DEFAULT_AUDIO_SINK@", &frac])
        {
            return Ok(());
        }
        let _ = try_run("pactl", &["set-sink-mute", "@DEFAULT_SINK@", "0"]);
        if try_run(
            "pactl",
            &["set-sink-volume", "@DEFAULT_SINK@", &format!("{percent}%")],
        ) {
            return Ok(());
        }
        Err(AdapterError::Execution(
            "could not set volume (tried wpctl and pactl)".into(),
        ))
    }
    #[cfg(target_os = "windows")]
    {
        set_windows_volume(percent)
    }
    #[cfg(target_os = "macos")]
    {
        // AppleScript's volume scale is 0-100, like `percent`. Unmute first so
        // the new level is actually heard.
        if try_run(
            "osascript",
            &[
                "-e",
                "set volume without output muted",
                "-e",
                &format!("set volume output volume {percent}"),
            ],
        ) {
            return Ok(());
        }
        Err(AdapterError::Execution(
            "could not set volume through osascript".into(),
        ))
    }
    #[cfg(not(any(target_os = "linux", target_os = "windows", target_os = "macos")))]
    {
        let _ = percent;
        Err(AdapterError::Unavailable(
            "volume control unsupported on this OS".into(),
        ))
    }
}

#[cfg(target_os = "windows")]
fn set_windows_volume(percent: u8) -> Result<(), AdapterError> {
    use windows::Win32::Foundation::RPC_E_CHANGED_MODE;
    use windows::Win32::Media::Audio::Endpoints::IAudioEndpointVolume;
    use windows::Win32::Media::Audio::{
        eMultimedia, eRender, IMMDeviceEnumerator, MMDeviceEnumerator,
    };
    use windows::Win32::System::Com::{
        CoCreateInstance, CoInitializeEx, CoUninitialize, CLSCTX_ALL, COINIT_MULTITHREADED,
    };

    // Core Audio is COM based. A Tauri worker may already have initialized COM
    // with a different apartment model; in that case COM is still usable.
    unsafe {
        let init = CoInitializeEx(None, COINIT_MULTITHREADED);
        if init.is_err() && init != RPC_E_CHANGED_MODE {
            return Err(AdapterError::Execution(format!(
                "COM initialization failed: {init}"
            )));
        }
        let result = (|| -> windows::core::Result<()> {
            let enumerator: IMMDeviceEnumerator =
                CoCreateInstance(&MMDeviceEnumerator, None, CLSCTX_ALL)?;
            let device = enumerator.GetDefaultAudioEndpoint(eRender, eMultimedia)?;
            let endpoint: IAudioEndpointVolume = device.Activate(CLSCTX_ALL, None)?;
            endpoint.SetMasterVolumeLevelScalar(f32::from(percent) / 100.0, std::ptr::null())?;
            Ok(())
        })();
        if init.is_ok() {
            CoUninitialize();
        }
        result.map_err(|e| AdapterError::Execution(format!("Core Audio: {e}")))
    }
}

#[cfg(target_os = "windows")]
fn probe_windows_audio() -> Result<(), AdapterError> {
    use windows::Win32::Foundation::RPC_E_CHANGED_MODE;
    use windows::Win32::Media::Audio::Endpoints::IAudioEndpointVolume;
    use windows::Win32::Media::Audio::{
        eMultimedia, eRender, IMMDeviceEnumerator, MMDeviceEnumerator,
    };
    use windows::Win32::System::Com::{
        CoCreateInstance, CoInitializeEx, CoUninitialize, CLSCTX_ALL, COINIT_MULTITHREADED,
    };

    // Core Audio is COM based. A Tauri worker may already have initialized COM
    // with a different apartment model; in that case COM is still usable.
    unsafe {
        let init = CoInitializeEx(None, COINIT_MULTITHREADED);
        if init.is_err() && init != RPC_E_CHANGED_MODE {
            return Err(AdapterError::Execution(format!(
                "COM initialization failed: {init}"
            )));
        }
        let result = (|| -> windows::core::Result<()> {
            let enumerator: IMMDeviceEnumerator =
                CoCreateInstance(&MMDeviceEnumerator, None, CLSCTX_ALL)?;
            let device = enumerator.GetDefaultAudioEndpoint(eRender, eMultimedia)?;
            let endpoint: IAudioEndpointVolume = device.Activate(CLSCTX_ALL, None)?;
            let _ = endpoint.GetMasterVolumeLevelScalar()?;
            Ok(())
        })();
        if init.is_ok() {
            CoUninitialize();
        }
        result.map_err(|e| AdapterError::Execution(format!("Core Audio: {e}")))
    }
}

#[cfg(target_os = "macos")]
fn probe_macos_audio() -> Result<(), AdapterError> {
    let out = std::process::Command::new("osascript")
        .args(["-e", "output volume of (get volume settings)"])
        .output()
        .map_err(|e| AdapterError::Unavailable(format!("osascript introuvable : {e}")))?;
    let volume = String::from_utf8_lossy(&out.stdout);
    // Outputs without a software volume (some HDMI/USB devices) report
    // "missing value" instead of a number.
    if !out.status.success() || volume.trim().parse::<u8>().is_err() {
        return Err(AdapterError::Unavailable(
            "La sortie audio actuelle ne permet pas de régler le volume".into(),
        ));
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use nexum_schema::OnError;
    use serde_json::json;

    fn step(percent: u32) -> ActionStep {
        ActionStep {
            order: 0,
            action_type: ids::AUDIO_SET_VOLUME.into(),
            params: json!({ "percent": percent }),
            enabled: true,
            on_error: OnError::Continue,
        }
    }

    #[test]
    fn rejects_volume_above_100() {
        assert!(AudioAdapter::new().validate(&step(100)).is_ok());
        assert!(AudioAdapter::new().validate(&step(101)).is_err());
    }

    /// Sets the output to its current volume, so nothing audibly changes.
    #[cfg(target_os = "macos")]
    #[tokio::test]
    #[ignore = "needs a Mac audio output with volume control"]
    async fn macos_volume_round_trips() {
        let read = || {
            let out = std::process::Command::new("osascript")
                .args(["-e", "output volume of (get volume settings)"])
                .output()
                .unwrap();
            String::from_utf8_lossy(&out.stdout)
                .trim()
                .parse::<u32>()
                .unwrap()
        };
        let before = read();

        AudioAdapter::probe().unwrap();
        let outcome = AudioAdapter::new().execute(&step(before)).await.unwrap();
        assert!(outcome.success);
        assert_eq!(read(), before);
    }
}

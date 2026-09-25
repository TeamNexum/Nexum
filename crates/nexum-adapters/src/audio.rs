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
        #[cfg(not(target_os = "windows"))]
        {
            Err(AdapterError::Unavailable(
                "Diagnostic audio disponible uniquement sur Windows".into(),
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
        if cfg!(any(target_os = "linux", target_os = "windows")) {
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

#[cfg(target_os = "linux")]
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
    #[cfg(not(any(target_os = "linux", target_os = "windows")))]
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

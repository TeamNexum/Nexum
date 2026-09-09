use async_trait::async_trait;

use nexum_core::{ActionOutcome, Adapter, AdapterError, Capability, ExecContext};
use nexum_schema::action_types::{ids, SetVolumeParams};
use nexum_schema::ActionStep;

use crate::util::{deser, ok};

/// Set the global output volume.
pub struct AudioAdapter;

impl AudioAdapter {
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
    fn name(&self) -> &str {
        "audio"
    }

    fn supported_actions(&self) -> Vec<String> {
        vec![ids::AUDIO_SET_VOLUME.into()]
    }

    async fn is_available(&self) -> Capability {
        if cfg!(target_os = "linux") {
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

    async fn execute(
        &self,
        step: &ActionStep,
        ctx: &ExecContext,
    ) -> Result<ActionOutcome, AdapterError> {
        self.validate(step)?;
        let p: SetVolumeParams = deser(step)?;
        if ctx.dry_run {
            return Ok(ok(step, format!("dry-run: would set volume to {}%", p.percent)));
        }
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
        if try_run("pactl", &["set-sink-volume", "@DEFAULT_SINK@", &format!("{percent}%")]) {
            return Ok(());
        }
        Err(AdapterError::Execution(
            "could not set volume (tried wpctl and pactl)".into(),
        ))
    }
    #[cfg(target_os = "windows")]
    {
        // TODO(nexum, Phase 0): implement via Windows Core Audio
        // (IMMDeviceEnumerator -> IAudioEndpointVolume::SetMasterVolumeLevelScalar)
        // using the `windows` crate. The prototype's PowerShell approach was a
        // NO-OP and must not be reused. Windows is the priority OS.
        let _ = percent;
        Err(AdapterError::Unavailable(
            "windows volume control not yet implemented (Core Audio TODO)".into(),
        ))
    }
    #[cfg(not(any(target_os = "linux", target_os = "windows")))]
    {
        let _ = percent;
        Err(AdapterError::Unavailable(
            "volume control unsupported on this OS".into(),
        ))
    }
}

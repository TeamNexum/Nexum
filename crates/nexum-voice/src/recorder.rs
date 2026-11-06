//! Microphone capture for push-to-talk.

use std::sync::mpsc;
use std::sync::{Arc, Mutex};
use std::thread::JoinHandle;

use cpal::traits::{DeviceTrait, HostTrait, StreamTrait};
use cpal::{FromSample, Sample, SampleFormat, SizedSample, StreamConfig};

/// Sample rate Whisper expects.
pub const WHISPER_RATE: u32 = 16_000;

/// A recording in progress. The audio stream lives on its own thread (cpal
/// streams are not `Send` on every platform), so a `Recorder` can be kept in
/// shared app state.
pub struct Recorder {
    stop: mpsc::Sender<()>,
    worker: JoinHandle<Result<Vec<f32>, String>>,
}

impl Recorder {
    /// Start recording from the default input device.
    pub fn start() -> Result<Recorder, String> {
        let (stop, stopped) = mpsc::channel();
        let (ready, started) = mpsc::channel();
        let worker = std::thread::spawn(move || record(stopped, ready));
        match started.recv() {
            Ok(Ok(())) => Ok(Recorder { stop, worker }),
            Ok(Err(e)) => Err(e),
            Err(_) => Err("the recording thread stopped unexpectedly".into()),
        }
    }

    /// Stop recording and return the audio as 16 kHz mono samples.
    pub fn stop(self) -> Result<Vec<f32>, String> {
        let _ = self.stop.send(());
        self.worker
            .join()
            .map_err(|_| "the recording thread panicked".to_string())?
    }
}

/// An open microphone stream and the buffer it fills.
struct Capture {
    stream: cpal::Stream,
    samples: Arc<Mutex<Vec<f32>>>,
    config: StreamConfig,
}

fn open_microphone() -> Result<Capture, String> {
    let device = cpal::default_host()
        .default_input_device()
        .ok_or("no microphone found")?;
    let supported = device
        .default_input_config()
        .map_err(|e| format!("cannot read the microphone settings: {e}"))?;
    let config = supported.config();
    let samples = Arc::new(Mutex::new(Vec::new()));
    let stream = match supported.sample_format() {
        SampleFormat::F32 => input_stream::<f32>(&device, &config, &samples),
        SampleFormat::I16 => input_stream::<i16>(&device, &config, &samples),
        SampleFormat::U16 => input_stream::<u16>(&device, &config, &samples),
        SampleFormat::I32 => input_stream::<i32>(&device, &config, &samples),
        other => Err(format!("unsupported microphone sample format {other:?}")),
    }?;
    stream
        .play()
        .map_err(|e| format!("cannot start the microphone: {e}"))?;
    Ok(Capture {
        stream,
        samples,
        config,
    })
}

fn record(
    stopped: mpsc::Receiver<()>,
    ready: mpsc::Sender<Result<(), String>>,
) -> Result<Vec<f32>, String> {
    let capture = match open_microphone() {
        Ok(capture) => {
            let _ = ready.send(Ok(()));
            capture
        }
        Err(e) => {
            let _ = ready.send(Err(e.clone()));
            return Err(e);
        }
    };
    let _ = stopped.recv();
    drop(capture.stream);

    let raw = std::mem::take(
        &mut *capture
            .samples
            .lock()
            .map_err(|_| "audio buffer poisoned")?,
    );
    Ok(to_whisper_format(
        &raw,
        capture.config.channels as usize,
        capture.config.sample_rate,
    ))
}

fn input_stream<T>(
    device: &cpal::Device,
    config: &StreamConfig,
    samples: &Arc<Mutex<Vec<f32>>>,
) -> Result<cpal::Stream, String>
where
    T: SizedSample,
    f32: FromSample<T>,
{
    let samples = Arc::clone(samples);
    device
        .build_input_stream(
            *config,
            move |data: &[T], _: &cpal::InputCallbackInfo| {
                if let Ok(mut buf) = samples.lock() {
                    buf.extend(data.iter().map(|&s| f32::from_sample(s)));
                }
            },
            |_err| {},
            None,
        )
        .map_err(|e| format!("cannot open the microphone: {e}"))
}

/// Average interleaved channels to mono, then resample linearly to 16 kHz.
fn to_whisper_format(interleaved: &[f32], channels: usize, rate: u32) -> Vec<f32> {
    let channels = channels.max(1);
    let mono: Vec<f32> = interleaved
        .chunks(channels)
        .map(|frame| frame.iter().sum::<f32>() / frame.len() as f32)
        .collect();
    if rate == WHISPER_RATE || mono.is_empty() {
        return mono;
    }
    let step = rate as f64 / WHISPER_RATE as f64;
    let len = (mono.len() as f64 / step) as usize;
    (0..len)
        .map(|i| {
            let pos = i as f64 * step;
            let idx = pos as usize;
            let frac = (pos - idx as f64) as f32;
            let next = mono.get(idx + 1).copied().unwrap_or(mono[idx]);
            mono[idx] * (1.0 - frac) + next * frac
        })
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn downmixes_stereo_and_resamples_to_16k() {
        // One second of 48 kHz stereo, left = 1.0, right = 0.0.
        let stereo: Vec<f32> = (0..48_000).flat_map(|_| [1.0, 0.0]).collect();
        let out = to_whisper_format(&stereo, 2, 48_000);
        assert_eq!(out.len(), 16_000);
        assert!(out.iter().all(|&s| (s - 0.5).abs() < 1e-6));
    }

    #[test]
    fn keeps_16k_mono_untouched() {
        let mono = vec![0.25; 1600];
        assert_eq!(to_whisper_format(&mono, 1, 16_000), mono);
    }
}

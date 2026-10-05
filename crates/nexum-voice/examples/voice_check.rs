//! Transcribe WAV files and show which mode each one would activate.
//!
//! cargo run -p nexum-voice --features whisper --example voice_check -- \
//!     ggml-base.bin "Gaming,Travail,Soirée Chill" clip1.wav clip2.wav

use nexum_schema::{Category, Mode};
use nexum_voice::transcriber::Transcriber;
use nexum_voice::{match_mode, recorder::WHISPER_RATE};

fn main() -> Result<(), String> {
    let mut args = std::env::args().skip(1);
    let usage = "usage: voice_check <model.bin> <mode names, comma-separated> <file.wav>...";
    let model = args.next().ok_or(usage)?;
    let names: Vec<String> = args
        .next()
        .ok_or(usage)?
        .split(',')
        .map(|n| n.trim().to_string())
        .collect();
    let modes: Vec<Mode> = names
        .iter()
        .map(|name| Mode {
            id: uuid::Uuid::new_v4(),
            name: name.clone(),
            description: None,
            category: Category::Custom,
            steps: vec![],
        })
        .collect();
    let vocabulary: Vec<&str> = names.iter().map(String::as_str).collect();

    let transcriber = Transcriber::load(model.as_ref())?;
    for file in args {
        let audio = read_wav(&file)?;
        let started = std::time::Instant::now();
        let text = transcriber.transcribe(&audio, "fr", &vocabulary)?;
        let mode = match_mode(&text, &modes).map_or("(aucun mode)", |m| m.name.as_str());
        println!(
            "{file}: « {text} » -> {mode}  [{} ms]",
            started.elapsed().as_millis()
        );
    }
    Ok(())
}

/// Read a 16 kHz mono WAV (e.g. `afconvert -f WAVE -d LEI16@16000 -c 1`).
fn read_wav(path: &str) -> Result<Vec<f32>, String> {
    let mut reader = hound::WavReader::open(path).map_err(|e| format!("{path}: {e}"))?;
    let spec = reader.spec();
    if spec.sample_rate != WHISPER_RATE || spec.channels != 1 {
        return Err(format!("{path}: expected 16 kHz mono audio"));
    }
    match spec.sample_format {
        hound::SampleFormat::Int => reader
            .samples::<i16>()
            .map(|s| s.map(|s| s as f32 / i16::MAX as f32))
            .collect::<Result<_, _>>(),
        hound::SampleFormat::Float => reader.samples::<f32>().collect::<Result<_, _>>(),
    }
    .map_err(|e| format!("{path}: {e}"))
}

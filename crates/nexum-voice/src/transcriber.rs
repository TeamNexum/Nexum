//! Local speech-to-text with whisper.cpp.

use std::path::Path;

use whisper_rs::{FullParams, SamplingStrategy, WhisperContext, WhisperContextParameters};

use crate::recorder::WHISPER_RATE;

/// A loaded Whisper model. Loading takes a moment, so keep one around.
pub struct Transcriber {
    ctx: WhisperContext,
}

impl Transcriber {
    /// Load a ggml Whisper model file (e.g. `ggml-base.bin`).
    pub fn load(model: &Path) -> Result<Transcriber, String> {
        let path = model.to_str().ok_or("the model path is not valid UTF-8")?;
        let ctx = WhisperContext::new_with_params(path, WhisperContextParameters::default())
            .map_err(|e| format!("cannot load the Whisper model {}: {e}", model.display()))?;
        Ok(Transcriber { ctx })
    }

    /// Transcribe 16 kHz mono audio. `language` is an ISO code ("fr", "en").
    /// `vocabulary` (the mode names) is given to Whisper as context, which
    /// makes it much more likely to spell them the way the user saved them.
    pub fn transcribe(
        &self,
        audio: &[f32],
        language: &str,
        vocabulary: &[&str],
    ) -> Result<String, String> {
        // Whisper refuses clips under one second; pad short ones with silence.
        let mut padded;
        let audio = if audio.len() < WHISPER_RATE as usize {
            padded = audio.to_vec();
            padded.resize(WHISPER_RATE as usize, 0.0);
            &padded[..]
        } else {
            audio
        };

        let prompt = format!("Nexum. Modes : {}.", vocabulary.join(", "));
        let mut params = FullParams::new(SamplingStrategy::Greedy { best_of: 1 });
        params.set_language(Some(language));
        params.set_initial_prompt(&prompt);
        params.set_no_context(true);
        params.set_single_segment(true);
        params.set_print_progress(false);
        params.set_print_realtime(false);
        params.set_print_special(false);
        params.set_print_timestamps(false);

        let mut state = self
            .ctx
            .create_state()
            .map_err(|e| format!("cannot start Whisper: {e}"))?;
        state
            .full(params, audio)
            .map_err(|e| format!("transcription failed: {e}"))?;
        let text: String = state.as_iter().map(|segment| segment.to_string()).collect();
        Ok(text.trim().to_string())
    }
}

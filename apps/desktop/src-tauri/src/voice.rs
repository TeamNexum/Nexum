//! Voice commands: hold a shortcut, say "lance le mode Gaming", let go.
//!
//! Speech is transcribed locally with Whisper (`nexum-voice`, cargo feature
//! `voice`), so nothing leaves the machine. The model (~150 MB) is downloaded
//! into the app-data dir the first time the user enables voice.
//!
//! The UI follows along through `voice-event`s: listening → transcribing →
//! done (or error), plus download progress.

use serde::Serialize;

/// Push-to-talk shortcut: hold it while speaking.
pub const SHORTCUT: &str = "CmdOrCtrl+Shift+Space";

#[derive(Serialize)]
pub struct VoiceStatus {
    /// False when the app was built without the `voice` feature.
    supported: bool,
    model_ready: bool,
    shortcut: &'static str,
}

#[derive(Clone, Serialize)]
#[cfg_attr(not(feature = "voice"), allow(dead_code))]
#[serde(tag = "state", rename_all = "snake_case")]
pub enum VoiceEvent {
    Listening,
    Transcribing,
    /// `mode` is the activated mode's name, `None` when nothing matched.
    /// `candidates` lists the modes that matched equally well, if several did.
    Done {
        transcript: String,
        mode: Option<String>,
        candidates: Vec<String>,
    },
    Error {
        message: String,
    },
    Download {
        downloaded: u64,
        total: Option<u64>,
    },
}

#[cfg(feature = "voice")]
pub use enabled::*;

#[cfg(feature = "voice")]
mod enabled {
    use std::path::PathBuf;
    use std::sync::{Arc, Mutex};

    use nexum_store::ModeStore;
    use nexum_voice::recorder::Recorder;
    use nexum_voice::transcriber::Transcriber;
    use nexum_voice::Recognized;
    use tauri::{AppHandle, Emitter, Manager, State};

    use super::{VoiceEvent, VoiceStatus, SHORTCUT};
    use crate::AppState;

    const MODEL_URL: &str =
        "https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.bin";
    const LANGUAGE: &str = "fr";

    pub struct Voice {
        model_path: PathBuf,
        recorder: Mutex<Option<Recorder>>,
        transcriber: Mutex<Option<Arc<Transcriber>>>,
    }

    impl Voice {
        pub fn new(data_dir: &std::path::Path) -> Voice {
            Voice {
                model_path: data_dir.join("models").join("ggml-base.bin"),
                recorder: Mutex::new(None),
                transcriber: Mutex::new(None),
            }
        }

        fn model_ready(&self) -> bool {
            self.model_path.is_file()
        }

        /// The loaded model, loading it on first use.
        fn transcriber(&self) -> Result<Arc<Transcriber>, String> {
            let mut slot = self.transcriber.lock().unwrap();
            if let Some(t) = slot.as_ref() {
                return Ok(t.clone());
            }
            let t = Arc::new(Transcriber::load(&self.model_path)?);
            *slot = Some(t.clone());
            Ok(t)
        }
    }

    fn emit(app: &AppHandle, event: VoiceEvent) {
        let _ = app.emit("voice-event", event);
    }

    /// Start listening (shortcut pressed). Errors are reported as events.
    pub fn begin(app: &AppHandle) {
        let voice = app.state::<Voice>();
        if !voice.model_ready() {
            emit(
                app,
                VoiceEvent::Error {
                    message:
                        "Le modèle vocal n’est pas encore téléchargé (Système → Commande vocale)."
                            .into(),
                },
            );
            return;
        }
        let mut recorder = voice.recorder.lock().unwrap();
        if recorder.is_some() {
            return; // key repeat while held
        }
        match Recorder::start() {
            Ok(r) => {
                *recorder = Some(r);
                emit(app, VoiceEvent::Listening);
            }
            Err(e) => emit(
                app,
                VoiceEvent::Error {
                    message: format!("Micro indisponible : {e}"),
                },
            ),
        }
    }

    /// Stop listening (shortcut released), transcribe, and activate the mode
    /// that was named.
    pub fn end(app: &AppHandle) {
        let Some(recorder) = app.state::<Voice>().recorder.lock().unwrap().take() else {
            return;
        };
        emit(app, VoiceEvent::Transcribing);
        let app = app.clone();
        tauri::async_runtime::spawn(async move {
            if let Err(message) = recognize(&app, recorder).await {
                emit(&app, VoiceEvent::Error { message });
            }
        });
    }

    async fn recognize(app: &AppHandle, recorder: Recorder) -> Result<(), String> {
        let state = app.state::<Arc<AppState>>().inner().clone();
        let modes = state.store.list().await.map_err(|e| e.to_string())?;
        // Mode names and keywords, given to Whisper so it spells them right.
        let names: Vec<String> = modes
            .iter()
            .flat_map(|m| std::iter::once(&m.name).chain(&m.voice_keywords))
            .cloned()
            .collect();

        let handle = app.clone();
        let transcript = tauri::async_runtime::spawn_blocking(move || {
            let audio = recorder.stop()?;
            let transcriber = handle.state::<Voice>().transcriber()?;
            let vocabulary: Vec<&str> = names.iter().map(String::as_str).collect();
            transcriber.transcribe(&audio, LANGUAGE, &vocabulary)
        })
        .await
        .map_err(|e| e.to_string())??;

        let (mode, candidates) = match nexum_voice::recognize(&transcript, &modes) {
            Recognized::Mode(mode) => (Some(mode.clone()), vec![]),
            Recognized::Ambiguous(modes) => (None, modes.iter().map(|m| m.name.clone()).collect()),
            Recognized::Nothing => (None, vec![]),
        };
        // Dev builds only: what Whisper heard, to tell a mishearing from a
        // matching problem. Release builds never log what the user said.
        if cfg!(debug_assertions) {
            eprintln!(
                "[voice] heard {transcript:?} -> {:?} {candidates:?}",
                mode.as_ref().map(|m| &m.name)
            );
        }
        emit(
            app,
            VoiceEvent::Done {
                transcript,
                mode: mode.as_ref().map(|m| m.name.clone()),
                candidates,
            },
        );
        if let Some(mode) = mode {
            state.engine.activate(&mode).await;
        }
        Ok(())
    }

    #[tauri::command]
    pub fn voice_status(voice: State<'_, Voice>) -> VoiceStatus {
        VoiceStatus {
            supported: true,
            model_ready: voice.model_ready(),
            shortcut: SHORTCUT,
        }
    }

    #[tauri::command]
    pub fn voice_start(app: AppHandle) {
        begin(&app);
    }

    #[tauri::command]
    pub fn voice_stop(app: AppHandle) {
        end(&app);
    }

    /// Download the Whisper model, reporting progress as `download` events.
    /// Writes to a `.part` file first so an interrupted download is never
    /// mistaken for a ready model.
    #[tauri::command]
    pub async fn voice_download_model(app: AppHandle) -> Result<(), String> {
        let path = app.state::<Voice>().model_path.clone();
        if path.is_file() {
            return Ok(());
        }
        let dir = path.parent().expect("model path has a parent");
        tokio::fs::create_dir_all(dir)
            .await
            .map_err(|e| format!("cannot create {}: {e}", dir.display()))?;
        let part = path.with_extension("bin.part");

        let mut response = reqwest::get(MODEL_URL)
            .await
            .and_then(|r| r.error_for_status())
            .map_err(|e| format!("téléchargement impossible : {e}"))?;
        let total = response.content_length();
        let mut file = tokio::fs::File::create(&part)
            .await
            .map_err(|e| e.to_string())?;
        let mut downloaded = 0u64;
        let mut last_emit = 0u64;
        use tokio::io::AsyncWriteExt;
        while let Some(chunk) = response
            .chunk()
            .await
            .map_err(|e| format!("téléchargement interrompu : {e}"))?
        {
            file.write_all(&chunk).await.map_err(|e| e.to_string())?;
            downloaded += chunk.len() as u64;
            if downloaded - last_emit >= 1 << 20 {
                last_emit = downloaded;
                emit(&app, VoiceEvent::Download { downloaded, total });
            }
        }
        file.flush().await.map_err(|e| e.to_string())?;
        drop(file);
        tokio::fs::rename(&part, &path)
            .await
            .map_err(|e| e.to_string())?;
        emit(&app, VoiceEvent::Download { downloaded, total });
        Ok(())
    }
}

/// Without the `voice` feature the commands still exist, so the UI can say
/// voice is unavailable in this build instead of failing on a missing command.
#[cfg(not(feature = "voice"))]
mod disabled {
    use super::{VoiceStatus, SHORTCUT};

    const UNSUPPORTED: &str = "Cette version de Nexum a été compilée sans la commande vocale.";

    #[tauri::command]
    pub fn voice_status() -> VoiceStatus {
        VoiceStatus {
            supported: false,
            model_ready: false,
            shortcut: SHORTCUT,
        }
    }

    #[tauri::command]
    pub fn voice_start() -> Result<(), String> {
        Err(UNSUPPORTED.into())
    }

    #[tauri::command]
    pub fn voice_stop() -> Result<(), String> {
        Err(UNSUPPORTED.into())
    }

    #[tauri::command]
    pub async fn voice_download_model() -> Result<(), String> {
        Err(UNSUPPORTED.into())
    }
}

#[cfg(not(feature = "voice"))]
pub use disabled::*;

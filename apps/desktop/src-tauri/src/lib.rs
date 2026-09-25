//! Tauri bridge: a *thin* layer between the React UI and `nexum-core`.
//!
//! It builds an [`Engine`] with the real adapters, seeds demo modes and
//! automation rules, forwards engine events to the webview in real time, and
//! exposes the command surface the frontend calls.

mod integrations;

use std::sync::Arc;

use chrono::{Datelike, Timelike};
use integrations::{IntegrationSettings, Integrations};
use nexum_adapters::{
    AudioAdapter, DisplayAdapter, GamingAdapter, HueAdapter, Switchable, SystemAdapter,
};
use nexum_core::Adapter;
use nexum_core::automation::{evaluate, EvalContext};
use nexum_core::marketplace::{assess, RiskReport};
use nexum_core::{ActionRegistry, Engine, EventBus, ExecutionReport};
use nexum_schema::action_types::ids;
use nexum_schema::automation::{AutomationRule, SystemEvent, Trigger};
use nexum_schema::{ActionStep, Category, Mode, OnError};
use nexum_store::{ModeStore, SqliteStore};
use tauri::menu::{Menu, MenuItem};
use tauri::tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent};
use tauri::{Emitter, Manager, State};
use tauri_plugin_global_shortcut::{GlobalShortcutExt, ShortcutState};
use uuid::Uuid;

/// Shared application state handed to every command.
struct AppState {
    engine: Engine,
    integrations: Integrations,
    store: SqliteStore,
    rules: Vec<AutomationRule>,
}

/// Activate a mode by id from a tray/hotkey handler (which only have the AppHandle).
fn fire_mode(app: &tauri::AppHandle, mode_id: u128) {
    let state = app.state::<Arc<AppState>>();
    let s = state.inner().clone();
    tauri::async_runtime::block_on(async move {
        if let Ok(mode) = s.store.get(Uuid::from_u128(mode_id)).await {
            let _ = s.engine.activate(&mode).await;
        }
    });
}

// ---- commands --------------------------------------------------------------

#[derive(serde::Serialize)]
struct ConnectionCheck {
    id: &'static str,
    available: bool,
    detail: String,
}

#[tauri::command]
async fn check_connections(state: State<'_, Arc<AppState>>) -> Result<Vec<ConnectionCheck>, String> {
    let audio = tokio::time::timeout(std::time::Duration::from_secs(6), tokio::task::spawn_blocking(AudioAdapter::probe));
    let display = tokio::time::timeout(std::time::Duration::from_secs(6), DisplayAdapter::probe());
    let hue_adapter = HueAdapter::with_config(state.integrations.hue());
    let hue = hue_adapter.probe();
    let (audio, display, hue) = tokio::join!(audio, display, hue);
    let audio = audio.map_err(|_| "Délai du diagnostic audio dépassé".to_string())
        .and_then(|result| result.map_err(|_| "Diagnostic audio interrompu".to_string()))
        .and_then(|result| result.map(|_| "Sortie audio par défaut accessible".to_string()).map_err(|e| e.to_string()));
    let display = display.map_err(|_| "Délai de lecture des écrans dépassé".to_string())
        .and_then(|result| result.map(|count| format!("{count} écran(s) lisible(s)")).map_err(|e| e.to_string()));
    let hue = hue.map(|_| "Pont Hue joignable et authentifié".to_string()).map_err(|e| e.to_string());
    Ok([("audio", audio), ("display", display), ("hue", hue)].into_iter()
        .map(|(id, result)| ConnectionCheck { id, available: result.is_ok(), detail: result.unwrap_or_else(|e| e) }).collect())
}

#[tauri::command]
fn get_integrations(state: State<'_, Arc<AppState>>) -> IntegrationSettings {
    state.integrations.get()
}

/// Save integration settings; they apply to the next activation.
#[tauri::command]
fn set_integrations(
    settings: IntegrationSettings,
    state: State<'_, Arc<AppState>>,
) -> Result<(), String> {
    state
        .integrations
        .update(settings)
        .map_err(|e| format!("could not save integration settings: {e}"))
}

#[tauri::command]
async fn get_modes(state: State<'_, Arc<AppState>>) -> Result<Vec<Mode>, String> {
    state.store.list().await.map_err(|e| e.to_string())
}

#[tauri::command]
async fn activate_mode(
    id: String,
    state: State<'_, Arc<AppState>>,
) -> Result<ExecutionReport, String> {
    let uuid: Uuid = id.parse().map_err(|_| "invalid mode id".to_string())?;
    let mode = state.store.get(uuid).await.map_err(|e| e.to_string())?;
    Ok(state.engine.activate(&mode).await)
}

/// Create or update a mode (no-code editor save).
#[tauri::command]
async fn save_mode(mode: Mode, state: State<'_, Arc<AppState>>) -> Result<(), String> {
    state.store.upsert(mode).await.map_err(|e| e.to_string())
}

#[tauri::command]
async fn delete_mode(id: String, state: State<'_, Arc<AppState>>) -> Result<(), String> {
    let uuid: Uuid = id.parse().map_err(|_| "invalid mode id".to_string())?;
    state.store.delete(uuid).await.map_err(|e| e.to_string())
}

/// The action_types the editor can offer (from the registered adapters).
#[tauri::command]
fn action_catalog(state: State<'_, Arc<AppState>>) -> Vec<String> {
    state.engine.action_types()
}

/// A fresh UUID for a newly created mode/step.
#[tauri::command]
fn new_id() -> String {
    Uuid::new_v4().to_string()
}

#[tauri::command]
fn get_automations(state: State<'_, Arc<AppState>>) -> Vec<AutomationRule> {
    state.rules.clone()
}

/// Simulate a clock tick: evaluate the rules and activate any matching modes.
/// Powers the "Chill after 18:00" demo without waiting for the real clock.
#[tauri::command]
async fn simulate_time(
    hour: u8,
    minute: u8,
    weekday: u8,
    state: State<'_, Arc<AppState>>,
) -> Result<Vec<String>, String> {
    let event = SystemEvent::Tick {
        hour,
        minute,
        weekday,
    };
    let ctx = EvalContext {
        hour,
        minute,
        weekday,
        active_modes: vec![],
    };
    let targets = evaluate(&event, &state.rules, &ctx);

    let mut activated = Vec::new();
    for id in targets {
        if let Ok(mode) = state.store.get(id).await {
            state.engine.activate(&mode).await;
            activated.push(mode.name);
        }
    }
    Ok(activated)
}

/// Static analysis + risk score of a (shared) mode for the Marketplace.
#[tauri::command]
fn assess_mode(mode: Mode, state: State<'_, Arc<AppState>>) -> RiskReport {
    assess(&mode, &state.engine.action_types())
}

/// Mode-as-Code: generate a draft Mode from a natural-language prompt.
/// (Heuristic today; swaps to a Claude API call in production — same output.)
#[tauri::command]
fn ai_generate(prompt: String) -> Mode {
    nexum_core::ai::generate_mode(&prompt, Uuid::new_v4())
}

// ---- setup -----------------------------------------------------------------

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            // Persistent store under the OS app-data dir — modes survive restarts.
            let data_dir = app
                .path()
                .app_data_dir()
                .unwrap_or_else(|_| std::env::temp_dir());
            std::fs::create_dir_all(&data_dir).ok();
            let db_path = data_dir.join("nexum.db");
            let store = SqliteStore::open(db_path.to_string_lossy().as_ref())
                .expect("failed to open the SQLite store");

            let integrations = Integrations::load(data_dir.join("integrations.json"));
            let state = Arc::new(AppState {
                engine: build_engine(&integrations),
                integrations,
                store,
                rules: demo_rules(),
            });

            // Seed demo modes only on first launch (empty DB); user edits persist.
            {
                let seed = state.clone();
                tauri::async_runtime::block_on(async move {
                    let empty = seed
                        .store
                        .list()
                        .await
                        .map(|m| m.is_empty())
                        .unwrap_or(true);
                    if empty {
                        for mode in demo_modes() {
                            let _ = seed.store.upsert(mode).await;
                        }
                    }
                });
            }

            // Forward engine events to the webview as "engine-event" so the UI
            // can render live action results as they happen.
            let handle = app.handle().clone();
            let mut rx = state.engine.bus().subscribe();
            tauri::async_runtime::spawn(async move {
                use tokio::sync::broadcast::error::RecvError;
                loop {
                    match rx.recv().await {
                        Ok(event) => {
                            let _ = handle.emit("engine-event", event);
                        }
                        Err(RecvError::Lagged(_)) => continue,
                        Err(RecvError::Closed) => break,
                    }
                }
            });

            // Autonomous scheduler: every 30s, fire automation rules on the real
            // clock (so "Chill at 18:00" happens on its own). Dedupe per minute.
            let sched = state.clone();
            tauri::async_runtime::spawn(async move {
                use std::collections::HashMap;
                let mut last: HashMap<Uuid, (u8, u8)> = HashMap::new();
                loop {
                    tokio::time::sleep(std::time::Duration::from_secs(30)).await;
                    let now = chrono::Local::now();
                    let (h, m) = (now.hour() as u8, now.minute() as u8);
                    let wd = now.weekday().num_days_from_monday() as u8;
                    let ev = SystemEvent::Tick {
                        hour: h,
                        minute: m,
                        weekday: wd,
                    };
                    let ctx = EvalContext {
                        hour: h,
                        minute: m,
                        weekday: wd,
                        active_modes: vec![],
                    };
                    for id in evaluate(&ev, &sched.rules, &ctx) {
                        if last.get(&id) == Some(&(h, m)) {
                            continue;
                        }
                        if let Ok(mode) = sched.store.get(id).await {
                            let _ = sched.engine.activate(&mode).await;
                            last.insert(id, (h, m));
                        }
                    }
                }
            });

            app.manage(state);

            // Right-click opens the native menu; left-click toggles the window.
            let show_i = MenuItem::with_id(app, "show", "Ouvrir Nexum", true, None::<&str>)?;
            let g_i = MenuItem::with_id(app, "act_gaming", "\u{1F3AE} Gaming", true, None::<&str>)?;
            let w_i = MenuItem::with_id(app, "act_work", "\u{1F4BC} Work", true, None::<&str>)?;
            let c_i = MenuItem::with_id(app, "act_chill", "\u{1F3B5} Chill", true, None::<&str>)?;
            let quit_i = MenuItem::with_id(app, "quit", "Quitter", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&show_i, &g_i, &w_i, &c_i, &quit_i])?;
            let _tray = TrayIconBuilder::new()
                .icon(app.default_window_icon().expect("app icon").clone())
                .menu(&menu)
                .show_menu_on_left_click(false)
                .on_menu_event(|app, event| match event.id.as_ref() {
                    "show" => {
                        if let Some(win) = app.get_webview_window("main") {
                            let _ = win.show();
                            let _ = win.set_focus();
                        }
                    }
                    "quit" => app.exit(0),
                    "act_gaming" => fire_mode(app, GAMING_ID),
                    "act_work" => fire_mode(app, WORK_ID),
                    "act_chill" => fire_mode(app, CHILL_ID),
                    _ => {}
                })
                .on_tray_icon_event(|tray, event| {
                    // Never change window visibility/focus on right-click: doing so
                    // dismisses the native menu, especially in Windows' overflow tray.
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event
                    {
                        let app = tray.app_handle();
                        if let Some(win) = app.get_webview_window("main") {
                            if win.is_visible().unwrap_or(false) {
                                let _ = win.hide();
                            } else {
                                let _ = win.show();
                                let _ = win.set_focus();
                            }
                        }
                    }
                })
                .build(app)?;

            // Global hotkey (best-effort): Ctrl/Cmd+Shift+G activates Gaming, even
            // when the window is closed. Non-fatal — the app runs if it fails.
            if app
                .handle()
                .plugin(
                    tauri_plugin_global_shortcut::Builder::new()
                        .with_handler(|app, _shortcut, event| {
                            if event.state() == ShortcutState::Pressed {
                                fire_mode(app, GAMING_ID);
                            }
                        })
                        .build(),
                )
                .is_ok()
            {
                let _ = app.global_shortcut().register("CmdOrCtrl+Shift+G");
            }

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            check_connections,
            get_integrations,
            set_integrations,
            get_modes,
            activate_mode,
            save_mode,
            delete_mode,
            action_catalog,
            new_id,
            get_automations,
            simulate_time,
            assess_mode,
            ai_generate
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

/// Every adapter is wrapped in a `Switchable` tied to its integration's on/off
/// setting; Hue reads the bridge paired through the app.
fn build_engine(integrations: &Integrations) -> Engine {
    let adapters: [(&str, Arc<dyn Adapter>); 5] = [
        ("system", Arc::new(SystemAdapter::new())),
        ("audio", Arc::new(AudioAdapter::new())),
        ("display", Arc::new(DisplayAdapter::new())),
        ("gaming", Arc::new(GamingAdapter::new())),
        ("hue", Arc::new(HueAdapter::with_config(integrations.hue()))),
    ];
    let mut registry = ActionRegistry::new();
    for (id, adapter) in adapters {
        registry.register(Arc::new(Switchable::new(adapter, integrations.switch(id))));
    }

    Engine::new(registry, EventBus::new())
}

// ---- demo data -------------------------------------------------------------

const GAMING_ID: u128 = 0x6a;
const WORK_ID: u128 = 0x77;
const CHILL_ID: u128 = 0xc1;

fn step(order: u32, action_type: &str, params: serde_json::Value, on_error: OnError) -> ActionStep {
    ActionStep {
        order,
        action_type: action_type.into(),
        params,
        enabled: true,
        on_error,
    }
}

fn demo_modes() -> Vec<Mode> {
    use serde_json::json;

    vec![
        Mode {
            id: Uuid::from_u128(GAMING_ID),
            name: "Gaming".into(),
            description: Some("High-performance setup and game launch".into()),
            category: Category::Gaming,
            steps: vec![
                step(
                    1,
                    ids::AUDIO_SET_VOLUME,
                    json!({ "percent": 70 }),
                    OnError::Continue,
                ),
                step(
                    2,
                    ids::DISPLAY_SET_BRIGHTNESS,
                    json!({ "percent": 100 }),
                    OnError::Continue,
                ),
                step(
                    3,
                    ids::IOT_HUE_ACTIVATE_SCENE,
                    json!({ "scene": "Purple Night" }),
                    OnError::Continue,
                ),
                step(
                    4,
                    ids::GAMING_LAUNCH_STEAM,
                    json!({ "app_id": "1030300" }),
                    OnError::Continue,
                ),
            ],
        },
        Mode {
            id: Uuid::from_u128(WORK_ID),
            name: "Work".into(),
            description: Some("Focus setup, minimal distractions".into()),
            category: Category::Work,
            steps: vec![
                step(
                    1,
                    ids::AUDIO_SET_VOLUME,
                    json!({ "percent": 20 }),
                    OnError::Continue,
                ),
                step(
                    2,
                    ids::DISPLAY_SET_BRIGHTNESS,
                    json!({ "percent": 70 }),
                    OnError::Continue,
                ),
                step(
                    3,
                    ids::IOT_HUE_ACTIVATE_SCENE,
                    json!({ "scene": "Focus White" }),
                    OnError::Continue,
                ),
                step(
                    4,
                    ids::SYSTEM_OPEN_URL,
                    json!({ "url": "https://docs.google.com/spreadsheets" }),
                    OnError::Continue,
                ),
            ],
        },
        Mode {
            id: Uuid::from_u128(CHILL_ID),
            name: "Chill".into(),
            description: Some("Ambient lighting and music".into()),
            category: Category::Chill,
            steps: vec![
                step(
                    1,
                    ids::AUDIO_SET_VOLUME,
                    json!({ "percent": 40 }),
                    OnError::Continue,
                ),
                step(
                    2,
                    ids::IOT_HUE_ACTIVATE_SCENE,
                    json!({ "scene": "Sunset Glow" }),
                    OnError::Continue,
                ),
                step(
                    3,
                    ids::SYSTEM_OPEN_URL,
                    json!({ "url": "https://open.spotify.com" }),
                    OnError::Continue,
                ),
            ],
        },
    ]
}

fn demo_rules() -> Vec<AutomationRule> {
    // Sarah's persona: switch to Chill automatically at 18:00 on weekdays.
    vec![AutomationRule {
        id: Uuid::from_u128(0xa1),
        name: "Chill automatically at 18:00".into(),
        enabled: true,
        target_mode_id: Uuid::from_u128(CHILL_ID),
        trigger: Trigger::TimeOfDay {
            hour: 18,
            minute: 0,
        },
        conditions: vec![],
    }]
}

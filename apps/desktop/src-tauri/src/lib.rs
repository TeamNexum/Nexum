//! Tauri bridge: a *thin* layer between the React UI and `nexum-core`.
//!
//! It builds an [`Engine`] with the real adapters (plus a mock for the
//! not-yet-implemented actions so demos run end-to-end), seeds demo modes and
//! automation rules, forwards engine events to the webview in real time, and
//! exposes the command surface the frontend calls.

use std::sync::Arc;

use nexum_adapters::{AudioAdapter, GamingAdapter, HueAdapter, MockAdapter, SystemAdapter};
use nexum_core::automation::{evaluate, EvalContext};
use nexum_core::marketplace::{assess, RiskReport};
use nexum_core::{ActionRegistry, Engine, EventBus, ExecContext, ExecutionReport};
use nexum_schema::action_types::ids;
use nexum_schema::automation::{AutomationRule, SystemEvent, Trigger};
use nexum_schema::{ActionStep, Category, Mode, OnError};
use nexum_store::{ModeStore, SqliteStore};
use chrono::{Datelike, Timelike};
use tauri::menu::{Menu, MenuItem};
use tauri::tray::{TrayIconBuilder, TrayIconEvent};
use tauri::{Emitter, Manager, State};
use tauri_plugin_global_shortcut::{GlobalShortcutExt, ShortcutState};
use uuid::Uuid;

/// Shared application state handed to every command.
struct AppState {
    engine: Engine,
    store: SqliteStore,
    rules: Vec<AutomationRule>,
}

/// Activate a mode by id from a tray/hotkey handler (which only have the AppHandle).
fn fire_mode(app: &tauri::AppHandle, mode_id: u128) {
    let state = app.state::<Arc<AppState>>();
    let s = state.inner().clone();
    tauri::async_runtime::block_on(async move {
        if let Ok(mode) = s.store.get(Uuid::from_u128(mode_id)).await {
            let _ = s.engine.activate(&mode, &ExecContext::default()).await;
        }
    });
}

// ---- commands --------------------------------------------------------------

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
    Ok(state.engine.activate(&mode, &ExecContext::default()).await)
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
    let event = SystemEvent::Tick { hour, minute, weekday };
    let ctx = EvalContext { hour, minute, weekday, active_modes: vec![] };
    let targets = evaluate(&event, &state.rules, &ctx);

    let mut activated = Vec::new();
    for id in targets {
        if let Ok(mode) = state.store.get(id).await {
            state.engine.activate(&mode, &ExecContext::default()).await;
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
        .plugin(tauri_plugin_opener::init())
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

            let state = Arc::new(AppState {
                engine: build_engine(),
                store,
                rules: demo_rules(),
            });

            // Seed demo modes only on first launch (empty DB); user edits persist.
            {
                let seed = state.clone();
                tauri::async_runtime::block_on(async move {
                    let empty = seed.store.list().await.map(|m| m.is_empty()).unwrap_or(true);
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
                    let ev = SystemEvent::Tick { hour: h, minute: m, weekday: wd };
                    let ctx = EvalContext { hour: h, minute: m, weekday: wd, active_modes: vec![] };
                    for id in evaluate(&ev, &sched.rules, &ctx) {
                        if last.get(&id) == Some(&(h, m)) {
                            continue;
                        }
                        if let Ok(mode) = sched.store.get(id).await {
                            let _ = sched.engine.activate(&mode, &ExecContext::default()).await;
                            last.insert(id, (h, m));
                        }
                    }
                }
            });

            app.manage(state);

            // System tray: activate a mode or show/quit; clicking toggles the window.
            let show_i = MenuItem::with_id(app, "show", "Ouvrir Nexum", true, None::<&str>)?;
            let g_i = MenuItem::with_id(app, "act_gaming", "\u{1F3AE} Gaming", true, None::<&str>)?;
            let w_i = MenuItem::with_id(app, "act_work", "\u{1F4BC} Work", true, None::<&str>)?;
            let c_i = MenuItem::with_id(app, "act_chill", "\u{1F3B5} Chill", true, None::<&str>)?;
            let quit_i = MenuItem::with_id(app, "quit", "Quitter", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&show_i, &g_i, &w_i, &c_i, &quit_i])?;
            let _tray = TrayIconBuilder::new()
                .icon(app.default_window_icon().expect("app icon").clone())
                .menu(&menu)
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
                    if let TrayIconEvent::Click { .. } = event {
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

fn build_engine() -> Engine {
    let mut registry = ActionRegistry::new();
    registry.register(Arc::new(SystemAdapter::new()));
    registry.register(Arc::new(AudioAdapter::new()));
    registry.register(Arc::new(GamingAdapter::new()));

    // Real Philips Hue when a bridge is configured (NEXUM_HUE_BRIDGE +
    // NEXUM_HUE_USER); otherwise a mock so the demo still runs end-to-end.
    let hue_ready =
        std::env::var("NEXUM_HUE_BRIDGE").is_ok() && std::env::var("NEXUM_HUE_USER").is_ok();
    if hue_ready {
        registry.register(Arc::new(HueAdapter::new()));
        registry.register(Arc::new(MockAdapter::new(vec![
            ids::DISPLAY_SET_BRIGHTNESS.into(),
            ids::PERIPHERAL_APPLY_RGB_PROFILE.into(),
        ])));
    } else {
        registry.register(Arc::new(MockAdapter::new(vec![
            ids::DISPLAY_SET_BRIGHTNESS.into(),
            ids::IOT_HUE_ACTIVATE_SCENE.into(),
            ids::PERIPHERAL_APPLY_RGB_PROFILE.into(),
        ])));
    }

    Engine::new(registry, EventBus::new())
}

// ---- demo data -------------------------------------------------------------

const GAMING_ID: u128 = 0x6a;
const WORK_ID: u128 = 0x77;
const CHILL_ID: u128 = 0xc1;

fn step(order: u32, action_type: &str, params: serde_json::Value, on_error: OnError) -> ActionStep {
    ActionStep { order, action_type: action_type.into(), params, enabled: true, on_error }
}

fn demo_modes() -> Vec<Mode> {
    use serde_json::json;

    vec![
        Mode {
            id: Uuid::from_u128(GAMING_ID),
            name: "Gaming".into(),
            description: Some("High-performance setup, RGB, game launch".into()),
            category: Category::Gaming,
            steps: vec![
                step(1, ids::AUDIO_SET_VOLUME, json!({ "percent": 70 }), OnError::Continue),
                step(2, ids::DISPLAY_SET_BRIGHTNESS, json!({ "percent": 100 }), OnError::Continue),
                step(3, ids::IOT_HUE_ACTIVATE_SCENE, json!({ "scene": "Purple Night" }), OnError::Continue),
                step(4, ids::PERIPHERAL_APPLY_RGB_PROFILE, json!({ "profile": "Neon Wave" }), OnError::Continue),
                step(5, ids::GAMING_LAUNCH_STEAM, json!({ "app_id": "1030300" }), OnError::Continue),
            ],
        },
        Mode {
            id: Uuid::from_u128(WORK_ID),
            name: "Work".into(),
            description: Some("Focus setup, minimal distractions".into()),
            category: Category::Work,
            steps: vec![
                step(1, ids::AUDIO_SET_VOLUME, json!({ "percent": 20 }), OnError::Continue),
                step(2, ids::DISPLAY_SET_BRIGHTNESS, json!({ "percent": 70 }), OnError::Continue),
                step(3, ids::IOT_HUE_ACTIVATE_SCENE, json!({ "scene": "Focus White" }), OnError::Continue),
                step(4, ids::SYSTEM_OPEN_URL, json!({ "url": "https://docs.google.com/spreadsheets" }), OnError::Continue),
            ],
        },
        Mode {
            id: Uuid::from_u128(CHILL_ID),
            name: "Chill".into(),
            description: Some("Ambient lighting and music".into()),
            category: Category::Chill,
            steps: vec![
                step(1, ids::AUDIO_SET_VOLUME, json!({ "percent": 40 }), OnError::Continue),
                step(2, ids::IOT_HUE_ACTIVATE_SCENE, json!({ "scene": "Sunset Glow" }), OnError::Continue),
                step(3, ids::SYSTEM_OPEN_URL, json!({ "url": "https://open.spotify.com" }), OnError::Continue),
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
        trigger: Trigger::TimeOfDay { hour: 18, minute: 0 },
        conditions: vec![],
    }]
}

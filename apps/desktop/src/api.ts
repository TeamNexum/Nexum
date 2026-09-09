// Typed wrappers around the Tauri command surface (see src-tauri/src/lib.rs).

import { invoke as tauriInvoke } from "@tauri-apps/api/core";
import { listen, type UnlistenFn } from "@tauri-apps/api/event";
import type {
  AutomationRule,
  EngineEvent,
  ExecutionReport,
  Mode,
  RiskReport,
} from "./types";

/** True only inside the Tauri desktop webview (where the Rust backend exists). */
export const IS_DESKTOP =
  typeof window !== "undefined" &&
  ("__TAURI_INTERNALS__" in window || "__TAURI__" in window);

const NOT_DESKTOP =
  "Ouvrez Nexum dans l'application de bureau — l'aperçu navigateur ne peut pas exécuter les actions.";

// Guarded invoke: a plain browser has no backend, so fail with a clear message
// instead of a raw "Cannot read properties of undefined (reading 'invoke')".
function invoke<T>(cmd: string, args?: Record<string, unknown>): Promise<T> {
  if (!IS_DESKTOP) return Promise.reject(new Error(NOT_DESKTOP));
  return tauriInvoke<T>(cmd, args);
}

export const api = {
  getModes: () => invoke<Mode[]>("get_modes"),
  activateMode: (id: string) => invoke<ExecutionReport>("activate_mode", { id }),
  saveMode: (mode: Mode) => invoke<void>("save_mode", { mode }),
  deleteMode: (id: string) => invoke<void>("delete_mode", { id }),
  actionCatalog: () => invoke<string[]>("action_catalog"),
  newId: () => invoke<string>("new_id"),
  getAutomations: () => invoke<AutomationRule[]>("get_automations"),
  simulateTime: (hour: number, minute: number, weekday: number) =>
    invoke<string[]>("simulate_time", { hour, minute, weekday }),
  assessMode: (mode: Mode) => invoke<RiskReport>("assess_mode", { mode }),
  aiGenerate: (prompt: string) => invoke<Mode>("ai_generate", { prompt }),
};

/** Subscribe to real-time engine events. Returns an unlisten function. */
export function onEngineEvent(
  handler: (event: EngineEvent) => void,
): Promise<UnlistenFn> {
  if (!IS_DESKTOP) return Promise.resolve(() => {}); // no events in browser preview
  return listen<EngineEvent>("engine-event", (e) => handler(e.payload));
}

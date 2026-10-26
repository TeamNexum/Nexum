// Forwards webview errors to the app's log file (see `log_plugin` in
// src-tauri/src/lib.rs, which also redacts secrets), so the logs a beta tester
// attaches to a report show what went wrong in the UI too.

import { error, warn } from "@tauri-apps/plugin-log";
import { IS_DESKTOP } from "./api";

function describe(value: unknown): string {
  return value instanceof Error ? `${value.message}\n${value.stack ?? ""}` : String(value);
}

export function forwardErrorsToLog(): void {
  if (!IS_DESKTOP) return;
  // Swallow failures: a logging error must never surface (or loop back here).
  const send = (write: typeof error, text: string) => void write(`[ui] ${text}`).catch(() => {});
  window.addEventListener("error", (e) => send(error, describe(e.error ?? e.message)));
  window.addEventListener("unhandledrejection", (e) => send(error, `unhandled rejection: ${describe(e.reason)}`));
  for (const [level, write] of [["error", error], ["warn", warn]] as const) {
    const original = console[level].bind(console);
    console[level] = (...args: unknown[]) => {
      original(...args);
      send(write, args.map(describe).join(" "));
    };
  }
}

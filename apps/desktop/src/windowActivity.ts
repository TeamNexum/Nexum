/**
 * Tracks whether the window is in use. When it is hidden, minimised or not focused, every canvas loop skips
 * its frames and CSS animations are paused (see `html[data-idle]` in styles.css), so Nexum costs no CPU or
 * GPU in the background.
 */
let active = typeof document === "undefined" ? true : !document.hidden && document.hasFocus();
const listeners = new Set<(active: boolean) => void>();

function apply(next: boolean) {
  if (next === active) return;
  active = next;
  document.documentElement.toggleAttribute("data-idle", !active);
  listeners.forEach(listener => listener(active));
}

if (typeof window !== "undefined") {
  const sync = () => apply(!document.hidden && document.hasFocus());
  window.addEventListener("focus", sync);
  window.addEventListener("blur", sync);
  document.addEventListener("visibilitychange", sync);
  document.documentElement.toggleAttribute("data-idle", !active);
}

export const isWindowActive = () => active;

/** Subscribes to focus changes; returns the unsubscribe function. */
export function onWindowActivity(listener: (active: boolean) => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

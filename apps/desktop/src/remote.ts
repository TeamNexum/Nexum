// Remote control: the desktop polls the cloud so the mobile companion can
// activate a mode on this machine. When signed in it reads the account's queue
// (see sync.ts). The direct, no-account queue that NexumAndroid uses on the LAN
// is unauthenticated, so it is opt-in (Settings) and only used while signed out.
// Delivery reuses the local 'activate_mode' Tauri command.

import { authedFetch, cloudUrl, isSignedIn, loadSession } from "./sync";

export type RemoteCommand = { kind: "activate_mode"; mode_id: string };

const DIRECT_KEY = "nexum.direct.enabled";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Only well-formed commands reach 'activate_mode'. */
export function isRemoteCommand(value: unknown): value is RemoteCommand {
  const v = value as Partial<RemoteCommand> | null;
  return !!v && typeof v === "object" && v.kind === "activate_mode" &&
    typeof v.mode_id === "string" && UUID.test(v.mode_id);
}

/** The no-account remote: off unless the user turned it on in Settings. */
export function isDirectEnabled(): boolean {
  try { return localStorage.getItem(DIRECT_KEY) === "true"; } catch { return false; }
}

/** Anyone who can reach the cloud can use the direct queue, so only while signed out. */
function directActive(): boolean {
  return isDirectEnabled() && !isSignedIn();
}

/** Turning it off also withdraws the modes this machine published. */
export async function setDirectEnabled(enabled: boolean): Promise<void> {
  localStorage.setItem(DIRECT_KEY, String(enabled));
  if (!enabled) await withdrawDirectModes();
}

/** Clears this machine's modes from the direct cache (e.g. once signed in). */
export function withdrawDirectModes(): Promise<void> {
  return putDirectModes([]);
}

function nextCommand(data: unknown): RemoteCommand | null {
  const command = (data as { command?: unknown } | null)?.command;
  return isRemoteCommand(command) ? command : null;
}

async function fetchNext(): Promise<RemoteCommand | null> {
  // 1. Signed in: the account's private queue.
  await loadSession();
  if (isSignedIn()) {
    try {
      const res = await authedFetch("/api/commands/next");
      if (res.ok) {
        const command = nextCommand(await res.json());
        if (command) return command;
      }
    } catch {
      // cloud unreachable or session gone — still try the direct queue
    }
  }

  // 2. Direct queue (phone on the LAN or via a tunnel, no account needed), if enabled.
  if (!directActive()) return null;
  try {
    const res = await fetch(`${cloudUrl()}/api/direct/commands/next`);
    if (!res.ok) return null;
    return nextCommand(await res.json());
  } catch {
    return null; // cloud unreachable — try again next tick
  }
}

/** Publish the desktop's modes to the direct cache so the phone sees them without an account. */
export async function syncDirectModes(modes: unknown[]): Promise<void> {
  if (directActive()) await putDirectModes(modes);
}

async function putDirectModes(modes: unknown[]): Promise<void> {
  try {
    await fetch(`${cloudUrl()}/api/direct/modes`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(modes),
    });
  } catch {
    // cloud unreachable — the next reload publishes again
  }
}

/**
 * Start polling for remote commands. Returns a stop function.
 * Drains the queue each tick (so several quick taps all apply), then waits.
 */
export function startRemoteControl(
  onCommand: (cmd: RemoteCommand) => void,
  intervalMs = 2500,
): () => void {
  let stopped = false;
  let timer: ReturnType<typeof setTimeout> | undefined;

  const tick = async () => {
    if (stopped) return;
    // Drain: keep pulling while commands are waiting.
    let cmd = await fetchNext();
    while (cmd && !stopped) {
      onCommand(cmd);
      cmd = await fetchNext();
    }
    if (!stopped) timer = setTimeout(tick, intervalMs);
  };

  tick();
  return () => {
    stopped = true;
    if (timer) clearTimeout(timer);
  };
}

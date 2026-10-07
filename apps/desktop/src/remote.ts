// Remote control: when signed in, the desktop polls the cloud command queue so
// the mobile companion can activate a mode on this machine. Auth stays in the
// frontend (the JWT lives in localStorage via sync.ts) and delivery reuses the
// local `activate_mode` Tauri command — so no Rust changes are needed here.

import { cloudUrl, token } from "./sync";

export type RemoteCommand = { kind: "activate_mode"; mode_id: string };

async function fetchNext(): Promise<RemoteCommand | null> {
  const t = token();
  const url = cloudUrl();

  // 1. If signed in, check user's private cloud queue
  if (t) {
    try {
      const res = await fetch(`${url}/api/commands/next`, {
        headers: { authorization: `Bearer ${t}` },
      });
      if (res.ok) {
        const data = (await res.json()) as { command: RemoteCommand | null };
        if (data.command) return data.command;
      }
    } catch {
      // ignore and try direct queue
    }
  }

  // 2. Poll direct / local queue (supports phone remote on LAN or tunnel without auth required)
  try {
    const res = await fetch(`${url}/api/direct/commands/next`);
    if (res.ok) {
      const data = (await res.json()) as { command: RemoteCommand | null };
      return data.command ?? null;
    }
  } catch {
    return null;
  }

  return null;
}

/** Push desktop modes to direct cache so mobile sees them immediately */
export async function syncDirectModes(modes: unknown[]): Promise<void> {
  try {
    await fetch(`${cloudUrl()}/api/direct/modes`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(modes),
    });
  } catch {}
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

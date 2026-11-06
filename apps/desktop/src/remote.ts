// Remote control: the desktop polls the cloud so the mobile companion can
// activate a mode on this machine. When signed in it reads the account's queue
// (see sync.ts); it always also reads the direct, no-account queue that
// NexumAndroid uses on the LAN. Delivery reuses the local 'activate_mode' Tauri
// command.

import { authedFetch, cloudUrl, isSignedIn, loadSession } from "./sync";

export type RemoteCommand = { kind: "activate_mode"; mode_id: string };

async function fetchNext(): Promise<RemoteCommand | null> {
  // 1. Signed in: the account's private queue.
  await loadSession();
  if (isSignedIn()) {
    try {
      const res = await authedFetch("/api/commands/next");
      if (res.ok) {
        const data = (await res.json()) as { command: RemoteCommand | null };
        if (data.command) return data.command;
      }
    } catch {
      // cloud unreachable or session gone — still try the direct queue
    }
  }

  // 2. Direct queue (phone on the LAN or via a tunnel, no account needed).
  try {
    const res = await fetch(`${cloudUrl()}/api/direct/commands/next`);
    if (!res.ok) return null;
    const data = (await res.json()) as { command: RemoteCommand | null };
    return data.command ?? null;
  } catch {
    return null; // cloud unreachable — try again next tick
  }
}

/** Publish the desktop's modes to the direct cache so the phone sees them without an account. */
export async function syncDirectModes(modes: unknown[]): Promise<void> {
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

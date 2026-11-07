// Automatic mode sync between this machine and the cloud.
//
// The server gives each mode a revision. We remember the revision and content we
// last agreed on (the "base"), which tells us what changed here, and we send each
// change with that revision. If the mode moved on elsewhere the server refuses:
// its version is kept, and ours becomes a copy named "… (conflit)", so neither
// side loses work.

import { api } from "./api";
import { cloud, currentUser, isSignedIn, loadSession, onSessionChange, sessionUrl, type ModeChange } from "./sync";
import type { Mode } from "./types";

const BASE_KEY = "nexum.cloud.syncBase";

const POLL_MS = 60_000;
const DEBOUNCE_MS = 2_000;

export interface LocalModes {
  list: () => Promise<Mode[]>;
  save: (mode: Mode) => Promise<void>;
  remove: (id: string) => Promise<void>;
  newId: () => Promise<string>;
}

const localModes: LocalModes = {
  list: api.getModes,
  save: api.saveMode,
  remove: api.deleteMode,
  newId: api.newId,
};

type Base = Record<string, { revision: number; json: string }>;

export interface SyncSummary {
  /** Local modes were written, so the UI should reload them. */
  changed: boolean;
  /** Names of the modes that were edited on both sides. */
  conflicts: string[];
}

// Scoped to the account and server: another one's revisions mean nothing here.
function loadBase(owner: string): Base {
  try {
    const stored = JSON.parse(localStorage.getItem(BASE_KEY) ?? "null");
    return stored?.owner === owner ? stored.entries : {};
  } catch {
    return {};
  }
}

function saveBase(owner: string, entries: Base): void {
  localStorage.setItem(BASE_KEY, JSON.stringify({ owner, entries }));
}

/** Stable JSON: the same mode always gives the same string, whatever the key order. */
function canonical(value: unknown): string {
  return JSON.stringify(value, (_key, v) =>
    v && typeof v === "object" && !Array.isArray(v)
      ? Object.fromEntries(Object.entries(v).sort(([a], [b]) => (a < b ? -1 : 1)))
      : v,
  );
}

const byId = (modes: Mode[]) => new Map(modes.map((m) => [m.id, m]));

function diff(local: Map<string, Mode>, base: Base): ModeChange[] {
  const changes: ModeChange[] = [];
  for (const [id, mode] of local) {
    const entry = base[id];
    if (!entry) changes.push({ id, base_revision: 0, mode });
    else if (entry.json !== canonical(mode)) changes.push({ id, base_revision: entry.revision, mode });
  }
  for (const [id, entry] of Object.entries(base)) {
    if (!local.has(id)) changes.push({ id, base_revision: entry.revision, mode: null });
  }
  return changes;
}

/** One exchange with the server. True if it left local work still to send. */
async function exchange(local: LocalModes, owner: string, summary: SyncSummary): Promise<boolean> {
  const base = loadBase(owner);
  const before = byId(await local.list());
  const changes = diff(before, base);
  const { modes: remote, conflicts } = await cloud.syncModes(changes);

  const conflicted = new Set(conflicts);
  const sent = new Set(changes.map((c) => c.id));
  const current = byId(await local.list());
  // A mode edited while the request was in flight is left for the next exchange.
  const untouched = (id: string) => canonical(before.get(id)) === canonical(current.get(id));
  const next: Base = {};
  const written: string[] = [];
  let again = false;

  for (const { revision, mode } of remote) {
    const { id } = mode;
    if (!untouched(id)) {
      if (sent.has(id) && !conflicted.has(id)) next[id] = { revision, json: canonical(before.get(id)) };
      else if (base[id]) next[id] = base[id];
      continue;
    }
    const mine = current.get(id);
    if (!mine || canonical(mine) !== canonical(mode)) {
      if (mine && conflicted.has(id)) {
        await local.save({ ...mine, id: await local.newId(), name: `${mine.name} (conflit)` });
        summary.conflicts.push(mine.name);
        again = true;
      }
      await local.save(mode);
      summary.changed = true;
    }
    next[id] = { revision, json: "" };
    written.push(id);
  }

  const onServer = new Set(remote.map((r) => r.mode.id));
  for (const id of new Set([...before.keys(), ...current.keys()])) {
    if (onServer.has(id)) continue;
    if (!untouched(id)) {
      if (base[id]) next[id] = base[id];
    } else if (conflicted.has(id)) {
      // Deleted elsewhere but edited here: the edit wins, sent again as new.
      again = true;
    } else if (base[id]) {
      await local.remove(id); // deleted elsewhere
      summary.changed = true;
    }
  }

  // As read back, not as received: a build that stores a mode slightly differently
  // must not see that as an edit and send it back over everyone else's.
  const stored = byId(await local.list());
  const received = byId(remote.map((r) => r.mode));
  for (const id of written) next[id].json = canonical(stored.get(id) ?? received.get(id));
  saveBase(owner, next);
  return again;
}

/** Bring this machine and the cloud in line. Throws if the cloud can't be reached. */
export async function syncOnce(local: LocalModes = localModes): Promise<SyncSummary> {
  const owner = `${sessionUrl()}|${currentUser()}`;
  const summary: SyncSummary = { changed: false, conflicts: [] };
  // Conflict copies are local edits too, so they need a second exchange.
  if (await exchange(local, owner, summary)) await exchange(local, owner, summary);
  return summary;
}

// ---- Background runner -------------------------------------------------------

export interface SyncStatus {
  syncing: boolean;
  lastSyncedAt: number | null;
  error: string | null;
  conflicts: string[];
}

let status: SyncStatus = { syncing: false, lastSyncedAt: null, error: null, conflicts: [] };
const statusListeners = new Set<(status: SyncStatus) => void>();

function setStatus(update: Partial<SyncStatus>): void {
  status = { ...status, ...update };
  statusListeners.forEach((listener) => listener(status));
}

export function syncStatus(): SyncStatus {
  return status;
}

export function onSyncStatus(listener: (status: SyncStatus) => void): () => void {
  statusListeners.add(listener);
  return () => statusListeners.delete(listener);
}

let onChanged: (() => void) | null = null;
let debounce: ReturnType<typeof setTimeout> | undefined;
let running: Promise<void> | null = null;
let rerun = false;

/** Sync now; if one is already running, run once more right after it. */
export function syncNow(): Promise<void> {
  if (running) {
    rerun = true;
    return running;
  }
  running = (async () => {
    do {
      rerun = false;
      await runOnce();
    } while (rerun);
  })().finally(() => {
    running = null;
  });
  return running;
}

async function runOnce(): Promise<void> {
  await loadSession();
  if (!isSignedIn()) return;
  setStatus({ syncing: true });
  try {
    const summary = await syncOnce();
    setStatus({
      syncing: false,
      lastSyncedAt: Date.now(),
      error: null,
      ...(summary.conflicts.length ? { conflicts: summary.conflicts } : {}),
    });
    if (summary.changed) onChanged?.();
  } catch (e) {
    setStatus({ syncing: false, error: e instanceof Error ? e.message : String(e) });
  }
}

/** Ask for a sync soon: several edits in a row only cause one. */
export function requestSync(delayMs = DEBOUNCE_MS): void {
  if (!onChanged) return;
  clearTimeout(debounce);
  debounce = setTimeout(() => void syncNow(), delayMs);
}

/** Keep modes in sync until the returned function is called. */
export function startAutoSync(changed: () => void, intervalMs = POLL_MS): () => void {
  onChanged = changed;
  const stopListening = onSessionChange(() => {
    if (isSignedIn()) requestSync(0);
    else setStatus({ lastSyncedAt: null, error: null, conflicts: [] });
  });
  const poll = setInterval(() => void syncNow(), intervalMs);
  void syncNow();
  return () => {
    onChanged = null;
    clearTimeout(debounce);
    clearInterval(poll);
    stopListening();
  };
}

// Cloud client — talks to the Nexum Cloud API over plain HTTP (fetch).
//
// A session is a short-lived access token, kept in memory only, and a long-lived
// refresh token, kept in the OS keychain on desktop (see src-tauri/src/secrets.rs).
// This module is transport-only: it never touches the local engine; the sync
// logic lives in autosync.ts.

import { api, IS_DESKTOP } from "./api";
import type { Mode } from "./types";

// Mirrors `FeedbackReport` in services/nexum-cloud/src/feedback.rs.
export interface FeedbackReport {
  message: string;
  contact: string | null;
  version: string;
  os: string;
  screenshot: { mime: string; data_base64: string } | null;
  logs: string | null;
}

const URL_KEY = "nexum.cloud.url";
const REFRESH_KEY = "nexum.cloud.refresh";
const USER_KEY = "nexum.cloud.user";

export const DEFAULT_CLOUD_URL = "http://localhost:8787";

const SESSION_EXPIRED = "Session expirée — reconnectez-vous.";

// The browser preview has no keychain, and no real data to protect.
const vault = IS_DESKTOP
  ? { load: api.loadCloudToken, save: api.saveCloudToken, clear: api.clearCloudToken }
  : {
      load: async () => localStorage.getItem(REFRESH_KEY),
      save: async (t: string) => localStorage.setItem(REFRESH_KEY, t),
      clear: async () => localStorage.removeItem(REFRESH_KEY),
    };

let accessToken: string | null = null;
let refreshToken: string | null = null;
let loading: Promise<void> | null = null;
let refreshing: Promise<void> | null = null;
let persisted = true;
const listeners = new Set<() => void>();

export function cloudUrl(): string {
  return localStorage.getItem(URL_KEY) || DEFAULT_CLOUD_URL;
}

export function setCloudUrl(url: string): void {
  localStorage.setItem(URL_KEY, url.trim().replace(/\/+$/, ""));
}

/** Read the stored session; safe to call repeatedly. */
export function loadSession(): Promise<void> {
  loading ??= (async () => {
    // Without a past sign-in there's nothing to read: don't make people who have
    // no account unlock their keychain.
    if (!currentUser()) return;
    try {
      refreshToken = await vault.load();
    } catch (e) {
      console.warn("Trousseau indisponible :", e);
    }
    notify();
  })();
  return loading;
}

/** Only meaningful once loadSession() has resolved. */
export function isSignedIn(): boolean {
  return !!refreshToken;
}

/** False when the keychain refused the token: the session ends with the app. */
export function isSessionPersisted(): boolean {
  return persisted;
}

/** Account id of the current session, which the sync state is scoped to. */
export function currentUser(): string | null {
  return localStorage.getItem(USER_KEY);
}

/** Be told when the user gets signed in or out, including by an expired session. */
export function onSessionChange(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notify(): void {
  listeners.forEach((listener) => listener());
}

interface Session {
  token: string;
  refresh_token: string;
  user_id: string;
}

async function setSession(session: Session): Promise<void> {
  accessToken = session.token;
  refreshToken = session.refresh_token;
  localStorage.setItem(USER_KEY, session.user_id);
  try {
    await vault.save(session.refresh_token);
    persisted = true;
  } catch (e) {
    console.warn("Trousseau indisponible :", e);
    persisted = false;
  }
}

export async function clearSession(): Promise<void> {
  accessToken = null;
  refreshToken = null;
  localStorage.removeItem(USER_KEY);
  try {
    await vault.clear();
    loading = null;
  } catch (e) {
    console.warn("Trousseau indisponible :", e);
  }
  notify();
}

/** End the session here and on the server (best effort: it expires anyway). */
export async function signOut(): Promise<void> {
  const revoked = refreshToken;
  await clearSession();
  if (!revoked) return;
  await fetch(`${cloudUrl()}/api/auth/logout`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ refresh_token: revoked }),
  }).catch(() => {});
}

// One at a time: a refresh token only works once, and using it twice looks like
// a theft to the server, which would end the session.
function refreshSession(): Promise<void> {
  refreshing ??= doRefresh().finally(() => {
    refreshing = null;
  });
  return refreshing;
}

async function doRefresh(): Promise<void> {
  const used = refreshToken;
  if (!used) throw new Error("Non connecté.");
  const res = await fetch(`${cloudUrl()}/api/auth/refresh`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ refresh_token: used }),
  });
  // Only a clear refusal ends the session, not a network or server failure.
  if (res.status === 401) {
    if (refreshToken === used) await clearSession();
    throw new Error(SESSION_EXPIRED);
  }
  if (!res.ok) throw new Error(`Erreur serveur (${res.status}).`);
  const session = (await res.json()) as Session;
  if (refreshToken === used) await setSession(session); // else: signed out meanwhile
}

/** A request with the access token, renewed first if it's missing or expired. */
export async function authedFetch(path: string, init: RequestInit = {}): Promise<Response> {
  await loadSession();
  if (!refreshToken) throw new Error("Non connecté.");
  if (!accessToken) await refreshSession();
  const send = () =>
    fetch(`${cloudUrl()}${path}`, {
      ...init,
      headers: { ...init.headers, authorization: `Bearer ${accessToken}` },
    });
  const res = await send();
  if (res.status !== 401) return res;
  await refreshSession();
  return send();
}

async function authRequest(path: string, email: string, password: string): Promise<void> {
  await loadSession();
  let res: Response;
  try {
    res = await fetch(`${cloudUrl()}${path}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    throw new Error(`Impossible de joindre le cloud (${cloudUrl()}). Est-il démarré ?`);
  }
  if (res.status === 400) {
    throw new Error("E-mail invalide ou mot de passe trop court (8 caractères minimum).");
  }
  if (res.status === 401) throw new Error("E-mail ou mot de passe incorrect.");
  if (res.status === 409) throw new Error("Cet e-mail est déjà utilisé.");
  if (!res.ok) throw new Error(`Erreur serveur (${res.status}).`);
  const session = (await res.json()) as Partial<Session>;
  if (!session?.token || !session.refresh_token || !session.user_id) {
    throw new Error("Réponse inattendue du serveur.");
  }
  await setSession(session as Session);
  notify();
}

/** A local edit: 'base_revision' is the last one seen (0 = new), 'mode' null = deleted. */
export interface ModeChange {
  id: string;
  base_revision: number;
  mode: Mode | null;
}

export interface SyncResponse {
  modes: { revision: number; mode: Mode }[];
  /** Changes refused because the mode moved on since their 'base_revision'. */
  conflicts: string[];
}

export const cloud = {
  register: (email: string, password: string) => authRequest("/api/auth/register", email, password),
  login: (email: string, password: string) => authRequest("/api/auth/login", email, password),
  signOut,
  isSignedIn,

  /** Send a beta report; the cloud forwards it to the team (no account needed). */
  async sendFeedback(report: FeedbackReport): Promise<void> {
    let res: Response;
    try {
      res = await fetch(`${cloudUrl()}/api/feedback`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(report),
      });
    } catch {
      throw new Error(`Impossible de joindre le cloud (${cloudUrl()}). Est-il démarré ?`);
    }
    if (res.ok) return;
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? `Erreur serveur (${res.status}).`);
  },

  /** Send local edits; returns the account's modes as they now stand. */
  async syncModes(changes: ModeChange[]): Promise<SyncResponse> {
    const res = await authedFetch("/api/modes/sync", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ changes }),
    });
    if (res.status === 401) throw new Error(SESSION_EXPIRED);
    if (!res.ok) throw new Error(`Erreur serveur (${res.status}).`);
    return (await res.json()) as SyncResponse;
  },
};

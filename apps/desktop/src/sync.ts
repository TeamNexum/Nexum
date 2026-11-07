// Cloud client — talks to the Nexum Cloud API over plain HTTP (fetch).
//
// A session is a short-lived access token, kept in memory only, and a long-lived
// refresh token, kept in the OS keychain on desktop (see src-tauri/src/secrets.rs).
// This module is transport-only: it never touches the local engine; the sync
// logic lives in autosync.ts.

import { api, IS_DESKTOP } from "./api";
import { CATEGORIES, type Mode } from "./types";

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
/** The server the current session was created on: its tokens never go anywhere else. */
const SESSION_URL_KEY = "nexum.cloud.sessionUrl";

const FALLBACK_CLOUD_URL = "http://localhost:8787";

// ---- Server address ----------------------------------------------------------

const PRIVATE_V4 = /^(10|127)\.|^192\.168\.|^169\.254\.|^172\.(1[6-9]|2\d|3[01])\./;

/** Loopback, private IPv4/IPv6 ranges and mDNS names: where plain http is tolerated. */
function isLocalHost(hostname: string): boolean {
  const host = hostname.replace(/^\[|\]$/g, "").toLowerCase();
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") || host === "::1") return true;
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) return PRIVATE_V4.test(host);
  return /^f[cd][0-9a-f]{2}:/.test(host) || host.startsWith("fe80:");
}

function isLoopback(hostname: string): boolean {
  const host = hostname.replace(/^\[|\]$/g, "").toLowerCase();
  return host === "localhost" || host.endsWith(".localhost") || host === "::1" || /^127\./.test(host);
}

/**
 * A usable cloud address, normalized (no trailing slash), or an Error explaining why not:
 * https anywhere, plain http only on this machine or the local network.
 */
export function parseCloudUrl(input: string): string {
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    throw new Error("Adresse du serveur invalide (exemple : https://cloud.exemple.com).");
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error("L’adresse du serveur doit commencer par https:// (ou http:// sur le réseau local).");
  }
  if (url.username || url.password) throw new Error("L’adresse du serveur ne doit pas contenir d’identifiants.");
  if (url.protocol === "http:" && !isLocalHost(url.hostname)) {
    throw new Error("Connexion non chiffrée refusée : utilisez https:// pour un serveur hors du réseau local.");
  }
  return `${url.origin}${url.pathname.replace(/\/+$/, "")}`;
}

/** Plain http beyond this machine: allowed on the LAN, but worth a warning. */
export function isInsecureCloudUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" && !isLoopback(parsed.hostname);
  } catch {
    return false;
  }
}

function safeCloudUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    return parseCloudUrl(value);
  } catch {
    return null;
  }
}

export const DEFAULT_CLOUD_URL = safeCloudUrl(import.meta.env.VITE_NEXUM_CLOUD_URL) ?? FALLBACK_CLOUD_URL;

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
  return safeCloudUrl(localStorage.getItem(URL_KEY)) ?? DEFAULT_CLOUD_URL;
}

/** Throws (with a user-facing message) if the address is not acceptable. */
export function setCloudUrl(url: string): void {
  localStorage.setItem(URL_KEY, parseCloudUrl(url));
}

/** Where the current session's requests go: the server it was created on. */
export function sessionUrl(): string {
  return safeCloudUrl(localStorage.getItem(SESSION_URL_KEY)) ?? cloudUrl();
}

/** Read the stored session; safe to call repeatedly. */
export function loadSession(): Promise<void> {
  loading ??= (async () => {
    // Without a past sign-in there's nothing to read: don't make people who have
    // no account unlock their keychain.
    if (!currentUser()) return;
    // Sessions from before the URL was recorded belong to the server configured then.
    if (!localStorage.getItem(SESSION_URL_KEY)) localStorage.setItem(SESSION_URL_KEY, cloudUrl());
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

const UNEXPECTED = "Réponse inattendue du serveur.";

const nonEmpty = (v: unknown): v is string => typeof v === "string" && v.length > 0;

function isSession(v: Partial<Session> | null): v is Session {
  return !!v && nonEmpty(v.token) && nonEmpty(v.refresh_token) && nonEmpty(v.user_id);
}

// ---- Response shape guards ---------------------------------------------------
// Whatever the server sends ends up in the local engine (and runs on activation),
// so nothing is trusted on its type annotation alone. (Ids are UUIDs; the Rust
// side rejects anything else when the mode is saved.)

const isRecord = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);

function isStep(v: unknown): boolean {
  return isRecord(v) && Number.isInteger(v.order) && nonEmpty(v.type) && isRecord(v.params) &&
    typeof v.enabled === "boolean" && (v.on_error === "continue" || v.on_error === "abort");
}

export function isMode(v: unknown): v is Mode {
  return isRecord(v) && nonEmpty(v.id) && typeof v.name === "string" &&
    (v.description === null || v.description === undefined || typeof v.description === "string") &&
    CATEGORIES.includes(v.category as Mode["category"]) &&
    Array.isArray(v.steps) && v.steps.every(isStep) &&
    (v.voice_keywords === undefined || (Array.isArray(v.voice_keywords) && v.voice_keywords.every((k) => typeof k === "string")));
}

export function isSyncResponse(v: unknown): v is SyncResponse {
  return isRecord(v) && Array.isArray(v.modes) && Array.isArray(v.conflicts) &&
    v.conflicts.every((id) => typeof id === "string") &&
    v.modes.every((m) => isRecord(m) && Number.isInteger(m.revision) && (m.revision as number) >= 0 && isMode(m.mode));
}

async function setSession(session: Session, url: string): Promise<void> {
  accessToken = session.token;
  refreshToken = session.refresh_token;
  localStorage.setItem(USER_KEY, session.user_id);
  localStorage.setItem(SESSION_URL_KEY, url);
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
  localStorage.removeItem(SESSION_URL_KEY);
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
  const url = sessionUrl();
  await clearSession();
  if (!revoked) return;
  await fetch(`${url}/api/auth/logout`, {
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
  const url = sessionUrl();
  const res = await fetch(`${url}/api/auth/refresh`, {
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
  const session = (await res.json().catch(() => null)) as Partial<Session> | null;
  if (!isSession(session)) throw new Error(UNEXPECTED);
  if (refreshToken === used) await setSession(session, url); // else: signed out meanwhile
}

/** A request with the access token, renewed first if it's missing or expired. */
export async function authedFetch(path: string, init: RequestInit = {}): Promise<Response> {
  await loadSession();
  if (!refreshToken) throw new Error("Non connecté.");
  if (!accessToken) await refreshSession();
  const send = () =>
    fetch(`${sessionUrl()}${path}`, {
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
  const url = cloudUrl();
  let res: Response;
  try {
    res = await fetch(`${url}${path}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    throw new Error(`Impossible de joindre le cloud (${url}). Est-il démarré ?`);
  }
  if (res.status === 400) {
    throw new Error("E-mail invalide ou mot de passe trop court (8 caractères minimum).");
  }
  if (res.status === 401) throw new Error("E-mail ou mot de passe incorrect.");
  if (res.status === 409) throw new Error("Cet e-mail est déjà utilisé.");
  if (!res.ok) throw new Error(`Erreur serveur (${res.status}).`);
  const session = (await res.json().catch(() => null)) as Partial<Session> | null;
  if (!isSession(session)) throw new Error(UNEXPECTED);
  await setSession(session, url);
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
    const body: unknown = await res.json().catch(() => null);
    if (!isSyncResponse(body)) throw new Error(UNEXPECTED);
    return body;
  },
};

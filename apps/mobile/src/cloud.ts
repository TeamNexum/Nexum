// Cloud client for the mobile companion. Talks only to the Nexum Cloud REST API
// (auth + sync + remote-command queue) — the phone never runs the engine.
//
// Types come from @nexum/schema (generated from Rust), so the companion can't
// drift from the desktop's model.

import type { Mode } from "../../../packages/schema-ts/src";

const URL_KEY = "nexum.cloud.url";
const REFRESH_KEY = "nexum.cloud.refresh";
/** The server the current session was created on: its tokens never go anywhere else. */
const SESSION_URL_KEY = "nexum.cloud.sessionUrl";

const FALLBACK_CLOUD_URL = "http://localhost:8787";

// Same rules as apps/desktop/src/sync.ts: https anywhere, plain http only on
// this device or the local network.
const PRIVATE_V4 = /^(10|127)\.|^192\.168\.|^169\.254\.|^172\.(1[6-9]|2\d|3[01])\./;

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

/** A usable cloud address, normalized (no trailing slash), or an Error explaining why not. */
export function parseCloudUrl(input: string): string {
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    throw new Error("Adresse du serveur invalide (exemple : http://192.168.1.20:8787).");
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

/** Plain http beyond this device: allowed on the LAN, but worth a warning. */
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

// In memory only: it lasts minutes, and the refresh token renews it on demand.
let accessToken: string | null = null;
let refreshing: Promise<void> | null = null;

export function cloudUrl(): string {
  return safeCloudUrl(localStorage.getItem(URL_KEY)) ?? DEFAULT_CLOUD_URL;
}
/** Throws (with a user-facing message) if the address is not acceptable. */
export function setCloudUrl(url: string): void {
  localStorage.setItem(URL_KEY, parseCloudUrl(url));
}
/** Where the current session's requests go; sessions from before this was recorded use the configured server. */
function sessionUrl(): string {
  return safeCloudUrl(localStorage.getItem(SESSION_URL_KEY)) ?? cloudUrl();
}
export function isSignedIn(): boolean {
  return !!localStorage.getItem(REFRESH_KEY);
}

interface Session {
  token: string;
  refresh_token: string;
}

function setSession(session: Session, url: string): void {
  accessToken = session.token;
  localStorage.setItem(REFRESH_KEY, session.refresh_token);
  localStorage.setItem(SESSION_URL_KEY, url);
}

function clearSession(): void {
  accessToken = null;
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(SESSION_URL_KEY);
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
  const used = localStorage.getItem(REFRESH_KEY);
  if (!used) throw new Error("Non connecté.");
  const url = sessionUrl();
  const res = await fetch(`${url}/api/auth/refresh`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ refresh_token: used }),
  });
  // Only a clear refusal ends the session, not a network or server failure.
  if (res.status === 401) {
    clearSession();
    throw new Error(SESSION_EXPIRED);
  }
  if (!res.ok) throw new Error(`Erreur serveur (${res.status}).`);
  const session = (await res.json().catch(() => null)) as Partial<Session> | null;
  if (!session?.token || !session.refresh_token) throw new Error("Réponse inattendue du serveur.");
  if (localStorage.getItem(REFRESH_KEY) === used) setSession(session as Session, url); // else: signed out meanwhile
}

/** A request with the access token, renewed first if it's missing or expired. */
async function authedFetch(path: string, init: RequestInit = {}): Promise<Response> {
  if (!isSignedIn()) throw new Error("Non connecté.");
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

async function jsonOrThrow(res: Response): Promise<unknown> {
  if (res.ok) return res.status === 204 || res.status === 202 ? null : res.json();
  if (res.status === 401) throw new Error(SESSION_EXPIRED);
  throw new Error(`Erreur serveur (${res.status}).`);
}

async function authRequest(path: string, email: string, password: string): Promise<void> {
  const url = cloudUrl();
  let res: Response;
  try {
    res = await fetch(`${url}${path}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    throw new Error(`Impossible de joindre ${url}. Vérifiez l'adresse et le réseau.`);
  }
  if (res.status === 400) {
    throw new Error("E-mail invalide ou mot de passe trop court (8 caractères minimum).");
  }
  if (res.status === 401) throw new Error("E-mail ou mot de passe incorrect.");
  if (res.status === 409) throw new Error("Cet e-mail est déjà utilisé.");
  if (!res.ok) throw new Error(`Erreur serveur (${res.status}).`);
  const session = (await res.json()) as Partial<Session>;
  if (!session?.token || !session.refresh_token) throw new Error("Réponse inattendue du serveur.");
  setSession(session as Session, url);
}

export const cloud = {
  register: (email: string, password: string) => authRequest("/api/auth/register", email, password),
  login: (email: string, password: string) => authRequest("/api/auth/login", email, password),

  /** End the session here and on the server (best effort: it expires anyway). */
  async signOut(): Promise<void> {
    const revoked = localStorage.getItem(REFRESH_KEY);
    const url = sessionUrl();
    clearSession();
    if (!revoked) return;
    await fetch(`${url}/api/auth/logout`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ refresh_token: revoked }),
    }).catch(() => {});
  },

  /** The account's synced modes (pushed from a desktop). */
  async modes(): Promise<Mode[]> {
    return (await jsonOrThrow(await authedFetch("/api/modes"))) as Mode[];
  },

  /** Ask the user's desktop to activate a mode (queued; desktop polls). */
  async activate(modeId: string): Promise<void> {
    const res = await authedFetch("/api/commands", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ kind: "activate_mode", mode_id: modeId }),
    });
    await jsonOrThrow(res);
  },
};

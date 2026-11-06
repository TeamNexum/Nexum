// Cloud client for the mobile companion. Talks only to the Nexum Cloud REST API
// (auth + sync + remote-command queue) — the phone never runs the engine.
//
// Types come from @nexum/schema (generated from Rust), so the companion can't
// drift from the desktop's model.

import type { Mode } from "../../../packages/schema-ts/src";

const URL_KEY = "nexum.cloud.url";
const REFRESH_KEY = "nexum.cloud.refresh";

export const DEFAULT_CLOUD_URL =
  import.meta.env.VITE_NEXUM_CLOUD_URL || "http://localhost:8787";

const SESSION_EXPIRED = "Session expirée — reconnectez-vous.";

// In memory only: it lasts minutes, and the refresh token renews it on demand.
let accessToken: string | null = null;
let refreshing: Promise<void> | null = null;

export function cloudUrl(): string {
  return localStorage.getItem(URL_KEY) || DEFAULT_CLOUD_URL;
}
export function setCloudUrl(url: string): void {
  localStorage.setItem(URL_KEY, url.trim().replace(/\/+$/, ""));
}
export function isSignedIn(): boolean {
  return !!localStorage.getItem(REFRESH_KEY);
}

interface Session {
  token: string;
  refresh_token: string;
}

function setSession(session: Session): void {
  accessToken = session.token;
  localStorage.setItem(REFRESH_KEY, session.refresh_token);
}

function clearSession(): void {
  accessToken = null;
  localStorage.removeItem(REFRESH_KEY);
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
  const res = await fetch(`${cloudUrl()}/api/auth/refresh`, {
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
  const session = (await res.json()) as Session;
  if (localStorage.getItem(REFRESH_KEY) === used) setSession(session); // else: signed out meanwhile
}

/** A request with the access token, renewed first if it's missing or expired. */
async function authedFetch(path: string, init: RequestInit = {}): Promise<Response> {
  if (!isSignedIn()) throw new Error("Non connecté.");
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

async function jsonOrThrow(res: Response): Promise<unknown> {
  if (res.ok) return res.status === 204 || res.status === 202 ? null : res.json();
  if (res.status === 401) throw new Error(SESSION_EXPIRED);
  throw new Error(`Erreur serveur (${res.status}).`);
}

async function authRequest(path: string, email: string, password: string): Promise<void> {
  let res: Response;
  try {
    res = await fetch(`${cloudUrl()}${path}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    throw new Error(`Impossible de joindre ${cloudUrl()}. Vérifiez l'adresse et le réseau.`);
  }
  if (res.status === 400) {
    throw new Error("E-mail invalide ou mot de passe trop court (8 caractères minimum).");
  }
  if (res.status === 401) throw new Error("E-mail ou mot de passe incorrect.");
  if (res.status === 409) throw new Error("Cet e-mail est déjà utilisé.");
  if (!res.ok) throw new Error(`Erreur serveur (${res.status}).`);
  const session = (await res.json()) as Partial<Session>;
  if (!session?.token || !session.refresh_token) throw new Error("Réponse inattendue du serveur.");
  setSession(session as Session);
}

export const cloud = {
  register: (email: string, password: string) => authRequest("/api/auth/register", email, password),
  login: (email: string, password: string) => authRequest("/api/auth/login", email, password),

  /** End the session here and on the server (best effort: it expires anyway). */
  async signOut(): Promise<void> {
    const revoked = localStorage.getItem(REFRESH_KEY);
    clearSession();
    if (!revoked) return;
    await fetch(`${cloudUrl()}/api/auth/logout`, {
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

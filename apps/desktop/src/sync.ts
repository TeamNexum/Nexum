// Cloud sync client — talks to the Nexum Cloud API over plain HTTP (fetch).
//
// The JWT and the API base URL live in localStorage so a sign-in survives
// restarts. This module is transport-only: it never touches the local engine.
// The Settings panel wires "pull" into api.saveMode() to land modes locally.

import type { Mode } from "./types";

const URL_KEY = "nexum.cloud.url";
const TOKEN_KEY = "nexum.cloud.token";

export const DEFAULT_CLOUD_URL = "http://localhost:8787";

export function cloudUrl(): string {
  return localStorage.getItem(URL_KEY) || DEFAULT_CLOUD_URL;
}

export function setCloudUrl(url: string): void {
  localStorage.setItem(URL_KEY, url.trim().replace(/\/+$/, ""));
}

export function token(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function isSignedIn(): boolean {
  return !!token();
}

export function signOut(): void {
  localStorage.removeItem(TOKEN_KEY);
}

async function jsonOrThrow(res: Response): Promise<unknown> {
  if (res.ok) return res.status === 204 ? null : res.json();
  if (res.status === 401) throw new Error("Session expirée — reconnectez-vous.");
  if (res.status === 409) throw new Error("Cet e-mail est déjà utilisé.");
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
    throw new Error(`Impossible de joindre le cloud (${cloudUrl()}). Est-il démarré ?`);
  }
  const data = (await jsonOrThrow(res)) as { token?: string };
  if (!data?.token) throw new Error("Réponse inattendue du serveur.");
  localStorage.setItem(TOKEN_KEY, data.token);
}

function authHeader(): Record<string, string> {
  const t = token();
  if (!t) throw new Error("Non connecté.");
  return { authorization: `Bearer ${t}` };
}

export const cloud = {
  register: (email: string, password: string) => authRequest("/api/auth/register", email, password),
  login: (email: string, password: string) => authRequest("/api/auth/login", email, password),
  signOut,
  isSignedIn,

  /** Fetch this account's synced modes. */
  async pull(): Promise<Mode[]> {
    const res = await fetch(`${cloudUrl()}/api/modes`, { headers: authHeader() });
    return (await jsonOrThrow(res)) as Mode[];
  },

  /** Replace this account's modes with the given set (last-write-wins). */
  async push(modes: Mode[]): Promise<void> {
    const res = await fetch(`${cloudUrl()}/api/modes`, {
      method: "PUT",
      headers: { ...authHeader(), "content-type": "application/json" },
      body: JSON.stringify(modes),
    });
    await jsonOrThrow(res);
  },
};

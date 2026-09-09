// Cloud client for the mobile companion. Talks only to the Nexum Cloud REST API
// (auth + sync + remote-command queue) — the phone never runs the engine.
//
// Types come from @nexum/schema (generated from Rust), so the companion can't
// drift from the desktop's model.

import type { Mode } from "../../../packages/schema-ts/src/generated";

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

async function jsonOrThrow(res: Response): Promise<unknown> {
  if (res.ok) return res.status === 204 || res.status === 202 ? null : res.json();
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
    throw new Error(`Impossible de joindre ${cloudUrl()}. Vérifiez l'adresse et le réseau.`);
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
  signOut: () => localStorage.removeItem(TOKEN_KEY),

  /** The account's synced modes (pushed from a desktop). */
  async modes(): Promise<Mode[]> {
    const res = await fetch(`${cloudUrl()}/api/modes`, { headers: authHeader() });
    return (await jsonOrThrow(res)) as Mode[];
  },

  /** Ask the user's desktop to activate a mode (queued; desktop polls). */
  async activate(modeId: string): Promise<void> {
    const res = await fetch(`${cloudUrl()}/api/commands`, {
      method: "POST",
      headers: { ...authHeader(), "content-type": "application/json" },
      body: JSON.stringify({ kind: "activate_mode", mode_id: modeId }),
    });
    await jsonOrThrow(res);
  },
};

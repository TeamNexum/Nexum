import { useEffect, useState } from "react";
import { cloud, cloudUrl, setCloudUrl, isSignedIn } from "./cloud";
import type { Mode } from "../../../packages/schema-ts/src/generated";

const ICON: Record<string, string> = {
  gaming: "🎮",
  work: "💼",
  chill: "🌙",
  streaming: "🎥",
  night: "🌗",
  custom: "✨",
};

function msg(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

export default function App() {
  const [url, setUrl] = useState(cloudUrl());
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signedIn, setSignedIn] = useState(isSignedIn());
  const [modes, setModes] = useState<Mode[]>([]);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  function flash(text: string) {
    setToast(text);
    setTimeout(() => setToast(null), 1800);
  }

  async function loadModes() {
    setErr(null);
    try {
      setModes(await cloud.modes());
    } catch (e) {
      setErr(msg(e));
    }
  }

  useEffect(() => {
    if (signedIn) loadModes();
  }, [signedIn]);

  async function auth(kind: "login" | "register") {
    setBusy(true);
    setErr(null);
    try {
      setCloudUrl(url);
      await cloud[kind](email, password);
      setSignedIn(true);
      setPassword("");
    } catch (e) {
      setErr(msg(e));
    } finally {
      setBusy(false);
    }
  }

  async function activate(mode: Mode) {
    setBusy(true);
    setErr(null);
    try {
      await cloud.activate(mode.id);
      flash(`« ${mode.name} » envoyé à votre PC`);
    } catch (e) {
      setErr(msg(e));
    } finally {
      setBusy(false);
    }
  }

  function signOut() {
    cloud.signOut();
    setSignedIn(false);
    setModes([]);
  }

  return (
    <div className="app">
      <header>
        <span className="logo">⚡ NEXUM</span>
        <span className="sub">télécommande</span>
      </header>

      {!signedIn ? (
        <main className="auth">
          <label>
            Serveur (adresse de votre PC)
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="http://192.168.1.x:8787"
              inputMode="url"
              autoCapitalize="none"
              autoCorrect="off"
            />
          </label>
          <label>
            E-mail
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoCapitalize="none"
              autoCorrect="off"
            />
          </label>
          <label>
            Mot de passe
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <button className="primary" disabled={busy || !email || !password} onClick={() => auth("login")}>
            Se connecter
          </button>
          <button className="ghost" disabled={busy || !email || !password} onClick={() => auth("register")}>
            Créer un compte
          </button>
          {err && <p className="err">{err}</p>}
          <p className="hint">
            Utilisez le même compte que sur votre PC. Le PC doit être allumé, l'application ouverte et
            connectée (onglet ☁️).
          </p>
        </main>
      ) : (
        <main className="modes">
          <div className="bar">
            <button className="link" onClick={loadModes} disabled={busy}>
              ↻ Actualiser
            </button>
            <button className="link" onClick={signOut}>
              Se déconnecter
            </button>
          </div>
          {modes.length === 0 && (
            <p className="hint">
              Aucun mode synchronisé. Sur le PC, ouvrez ☁️ Account &amp; Sync puis « Envoyer », et
              actualisez ici.
            </p>
          )}
          <div className="grid">
            {modes.map((mode) => (
              <button key={mode.id} className="mode" disabled={busy} onClick={() => activate(mode)}>
                <span className="ic">{ICON[mode.category] ?? "✨"}</span>
                <span className="nm">{mode.name}</span>
                {mode.description && <span className="ds">{mode.description}</span>}
              </button>
            ))}
          </div>
          {err && <p className="err">{err}</p>}
        </main>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

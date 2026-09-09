import { useState } from "react";
import { api, IS_DESKTOP } from "../api";
import { cloud, cloudUrl, setCloudUrl, isSignedIn } from "../sync";
import type { Mode } from "../types";

/**
 * Cloud account + multi-device sync.
 *
 * Sign in once, then "Push" sends the local modes to the cloud and "Pull"
 * replaces the local modes with the account's set — the same account on another
 * machine (or the mobile companion) sees the same modes.
 */
export default function Settings({ modes, reload }: { modes: Mode[]; reload: () => void }) {
  const [url, setUrl] = useState(cloudUrl());
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signedIn, setSignedIn] = useState(isSignedIn());
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  function announce(fn: () => Promise<void>) {
    setBusy(true);
    setMsg(null);
    setErr(null);
    fn()
      .catch((e) => setErr(String(e instanceof Error ? e.message : e)))
      .finally(() => setBusy(false));
  }

  const saveUrl = () => {
    setCloudUrl(url);
    setMsg(`Cloud défini sur ${cloudUrl()}.`);
  };

  const auth = (mode: "login" | "register") =>
    announce(async () => {
      setCloudUrl(url);
      await cloud[mode](email, password);
      setSignedIn(true);
      setPassword("");
      setMsg(mode === "register" ? "Compte créé et connecté." : "Connecté.");
    });

  const signOut = () => {
    cloud.signOut();
    setSignedIn(false);
    setMsg("Déconnecté.");
  };

  const push = () =>
    announce(async () => {
      await cloud.push(modes);
      setMsg(`${modes.length} mode(s) synchronisé(s) vers le cloud.`);
    });

  const pull = () =>
    announce(async () => {
      const remote = await cloud.pull();
      if (!IS_DESKTOP) {
        setMsg(`${remote.length} mode(s) dans le cloud (ouvrez l'app de bureau pour les appliquer).`);
        return;
      }
      for (const mode of remote) await api.saveMode(mode);
      reload();
      setMsg(`${remote.length} mode(s) récupéré(s) et appliqué(s) localement.`);
    });

  return (
    <div className="settings">
      <section>
        <h2>Compte &amp; synchronisation</h2>
        <p className="muted">
          Connectez-vous pour synchroniser vos modes entre plusieurs machines et avec le compagnon
          mobile. Vos modes sont des données déclaratives — aucune donnée d'exécution ne quitte
          l'appareil.
        </p>

        <label className="field">
          Serveur cloud
          <div className="sim-row">
            <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder={cloudUrl()} />
            <button onClick={saveUrl}>Enregistrer</button>
          </div>
        </label>

        {!signedIn ? (
          <div className="auth-form">
            <label className="field">
              E-mail
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
              />
            </label>
            <label className="field">
              Mot de passe
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <div className="sim-row">
              <button
                className="primary"
                disabled={busy || !email || !password}
                onClick={() => auth("login")}
              >
                Se connecter
              </button>
              <button disabled={busy || !email || !password} onClick={() => auth("register")}>
                Créer un compte
              </button>
            </div>
          </div>
        ) : (
          <div className="synced">
            <p className="ok">✓ Connecté</p>
            <div className="sim-row">
              <button className="primary" disabled={busy} onClick={push}>
                ⬆ Envoyer {modes.length} mode(s)
              </button>
              <button disabled={busy} onClick={pull}>
                ⬇ Récupérer depuis le cloud
              </button>
              <button disabled={busy} onClick={signOut}>
                Se déconnecter
              </button>
            </div>
          </div>
        )}

        {msg && <div className="ok">{msg}</div>}
        {err && <div className="error">{err}</div>}
      </section>
    </div>
  );
}

import { useState } from "react";
import { api, IS_DESKTOP } from "../api";
import { cloud, cloudUrl, setCloudUrl, isSignedIn } from "../sync";
import type { Mode } from "../types";
import ConnectionStatus from "./ConnectionStatus";

/**
 * Cloud account + multi-device sync.
 *
 * Sign in once, then "Push" sends the local modes to the cloud and "Pull"
 * replaces the local modes with the account's set — the same account on another
 * machine (or the mobile companion) sees the same modes.
 */
export default function Settings({ modes, reload, density, onDensity }: { modes: Mode[]; reload: () => void; density: "compact" | "comfort"; onDensity: (value: "compact" | "comfort") => void }) {
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
      <div className="settings-main"><section className="context-panel">
        <h2>Compte &amp; synchronisation</h2>
        <p className="muted">
          Connectez-vous pour synchroniser vos modes entre plusieurs machines et avec le compagnon
          mobile. Vos modes sont des données déclaratives — aucune donnée d'exécution ne quitte
          l'appareil.
        </p>

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
      <ConnectionStatus />
      <section className="context-panel"><span className="workspace-kicker">INTERFACE</span><h2>Densité d’affichage</h2><p className="muted">Ajustez l’espace entre les cartes, les actions et les commandes sur toutes les pages.</p><div className="density-options"><button className="btn-secondary" aria-pressed={density === "compact"} onClick={() => onDensity("compact")}>Compact</button><button className="btn-secondary" aria-pressed={density === "comfort"} onClick={() => onDensity("comfort")}>Confort</button></div></section></div>
      <aside className="settings-aside">
        <section className="context-panel"><span className="workspace-kicker">CONNEXION</span><h2>Serveur de synchronisation</h2><p className="muted">L’adresse utilisée pour connecter votre compte et échanger vos profils.</p>
        <label className="field">
          Serveur cloud
          <div className="sim-row">
            <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder={cloudUrl()} />
            <button onClick={saveUrl}>Enregistrer</button>
          </div>
        </label>


        </section>
        <section className="context-panel"><span className="workspace-kicker">SUR CET APPAREIL</span><h2>Votre bibliothèque locale</h2>
          <div className="summary-strip"><div><strong>{modes.length}</strong><span>profils enregistrés</span></div><div><strong>{modes.reduce((n, m) => n + m.steps.length, 0)}</strong><span>actions</span></div></div>
          <dl className="system-facts"><div><dt>Environnement</dt><dd>{IS_DESKTOP ? "Application de bureau" : "Aperçu navigateur"}</dd></div><div><dt>Compte</dt><dd>{signedIn ? "Connecté" : "Non connecté"}</dd></div><div><dt>Synchronisation</dt><dd>Manuelle, à votre demande</dd></div></dl>
        </section>
      </aside>
    </div>
  );
}

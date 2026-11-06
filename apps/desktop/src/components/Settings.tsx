import { useEffect, useState } from "react";
import { IS_DESKTOP } from "../api";
import { onSyncStatus, syncNow, syncStatus } from "../autosync";
import { cloud, cloudUrl, setCloudUrl, isSessionPersisted, isSignedIn, loadSession, onSessionChange } from "../sync";
import type { Mode } from "../types";
import ConnectionStatus from "./ConnectionStatus";
import VoiceSettings from "./VoiceSettings";

/**
 * Cloud account + multi-device sync.
 *
 * Sign in once, then modes sync on their own (see autosync.ts) — the same
 * account on another machine (or the mobile companion) sees the same modes.
 */
export default function Settings({ modes, density, onDensity, motion, onMotion, onFeedback }: { modes: Mode[]; density: "compact" | "comfort"; onDensity: (value: "compact" | "comfort") => void; motion: "smooth" | "instant"; onMotion: (value: "smooth" | "instant") => void; onFeedback: () => void }) {
  const [url, setUrl] = useState(cloudUrl());
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signedIn, setSignedIn] = useState(isSignedIn());
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [sync, setSync] = useState(syncStatus());

  useEffect(() => {
    const update = () => setSignedIn(isSignedIn());
    loadSession().then(update);
    return onSessionChange(update);
  }, []);
  useEffect(() => onSyncStatus(setSync), []);

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
      const done = mode === "register" ? "Compte créé et connecté." : "Connecté.";
      setMsg(isSessionPersisted() ? done : `${done} Trousseau indisponible : il faudra vous reconnecter au prochain lancement.`);
    });

  const signOut = () =>
    announce(async () => {
      await cloud.signOut();
      setSignedIn(false);
      setMsg("Déconnecté.");
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
              <small className="muted">8 caractères minimum pour un nouveau compte.</small>
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
            <p className="muted">
              {!IS_DESKTOP
                ? "La synchronisation se fait depuis l'application de bureau."
                : sync.syncing
                  ? "Synchronisation en cours…"
                  : sync.lastSyncedAt
                    ? `Modes synchronisés à ${new Date(sync.lastSyncedAt).toLocaleTimeString()}.`
                    : "Synchronisation automatique activée."}
            </p>
            <div className="sim-row">
              <button className="primary" disabled={busy || sync.syncing || !IS_DESKTOP} onClick={() => void syncNow()}>
                Synchroniser maintenant
              </button>
              <button disabled={busy} onClick={signOut}>
                Se déconnecter
              </button>
            </div>
          </div>
        )}

        {msg && <div className="ok">{msg}</div>}
        {err && <div className="error">{err}</div>}
        {signedIn && sync.error && <div className="error">Synchronisation impossible : {sync.error}</div>}
        {signedIn && sync.conflicts.length > 0 && (
          <div className="error">
            Modifié sur plusieurs appareils : {sync.conflicts.map((name) => `« ${name} »`).join(", ")}. Votre version
            est conservée dans une copie nommée « … (conflit) ».
          </div>
        )}
      </section>
      <ConnectionStatus />
      <VoiceSettings />
      <section className="context-panel"><span className="workspace-kicker">INTERFACE</span><h2>Densité d’affichage</h2><p className="muted">Ajustez l’espace entre les cartes, les actions et les commandes sur toutes les pages.</p><div className="density-options"><button className="btn-secondary" aria-pressed={density === "compact"} onClick={() => onDensity("compact")}>Compact</button><button className="btn-secondary" aria-pressed={density === "comfort"} onClick={() => onDensity("comfort")}>Confort</button></div>
        <h2 className="settings-subheading">Changement de page</h2><p className="muted">Fluide : la galaxie voyage d’une page à l’autre. Instantané : la page change sans transition.</p><div className="density-options"><button className="btn-secondary" aria-pressed={motion === "smooth"} onClick={() => onMotion("smooth")}>Fluide</button><button className="btn-secondary" aria-pressed={motion === "instant"} onClick={() => onMotion("instant")}>Instantané</button></div></section></div>
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
        <section className="context-panel"><span className="workspace-kicker">BÊTA</span><h2>Un bug, une idée ?</h2><p className="muted">Écrivez à l'équipe en quelques secondes, avec une capture si besoin.</p><button className="primary" onClick={onFeedback}>Envoyer un retour</button></section>
        <section className="context-panel"><span className="workspace-kicker">SUR CET APPAREIL</span><h2>Votre bibliothèque locale</h2>
          <div className="summary-strip"><div><strong>{modes.length}</strong><span>profils enregistrés</span></div><div><strong>{modes.reduce((n, m) => n + m.steps.length, 0)}</strong><span>actions</span></div></div>
          <dl className="system-facts"><div><dt>Environnement</dt><dd>{IS_DESKTOP ? "Application de bureau" : "Aperçu navigateur"}</dd></div><div><dt>Compte</dt><dd>{signedIn ? "Connecté" : "Non connecté"}</dd></div><div><dt>Synchronisation</dt><dd>{IS_DESKTOP ? "Automatique" : "Depuis l’application de bureau"}</dd></div></dl>
        </section>
      </aside>
    </div>
  );
}

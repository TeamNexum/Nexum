import { useEffect, useState } from "react";
import { IS_DESKTOP } from "../api";
import { onSyncStatus, syncNow, syncStatus } from "../autosync";
import { cloud, cloudUrl, setCloudUrl, isInsecureCloudUrl, isSessionPersisted, isSignedIn, loadSession, onSessionChange, parseCloudUrl, sessionUrl } from "../sync";
import { isDirectEnabled, setDirectEnabled, syncDirectModes, withdrawDirectModes } from "../remote";
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
  const [direct, setDirect] = useState(isDirectEnabled());
  /** A new server address waiting for the user to accept being signed out. */
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const [urlErr, setUrlErr] = useState<string | null>(null);
  const insecure = (() => { try { return isInsecureCloudUrl(parseCloudUrl(url)); } catch { return false; } })();

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
    setMsg(null);
    setUrlErr(null);
    let next: string;
    try { next = parseCloudUrl(url); } catch (e) { setUrlErr(String(e instanceof Error ? e.message : e)); return; }
    // The session's tokens only ever go to the server they came from.
    if (signedIn && next !== sessionUrl()) { setPendingUrl(next); return; }
    setCloudUrl(next);
    setUrl(next);
    setMsg(`Cloud défini sur ${next}.`);
  };

  const confirmUrlChange = () =>
    announce(async () => {
      const next = pendingUrl;
      setPendingUrl(null);
      if (!next) return;
      await cloud.signOut();
      setSignedIn(false);
      setCloudUrl(next);
      setUrl(next);
      setMsg(`Déconnecté. Cloud défini sur ${next} : reconnectez-vous sur ce serveur.`);
    });

  const auth = (mode: "login" | "register") =>
    announce(async () => {
      setCloudUrl(url);
      await cloud[mode](email, password);
      setSignedIn(true);
      setPassword("");
      if (isDirectEnabled()) await withdrawDirectModes(); // the account queue takes over

      const done = mode === "register" ? "Compte créé et connecté." : "Connecté.";
      setMsg(isSessionPersisted() ? done : `${done} Trousseau indisponible : il faudra vous reconnecter au prochain lancement.`);
    });

  const toggleDirect = (enabled: boolean) =>
    announce(async () => {
      await setDirectEnabled(enabled);
      setDirect(enabled);
      if (enabled) await syncDirectModes(modes);
      setMsg(enabled ? "Télécommande directe activée." : "Télécommande directe désactivée.");
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
            <input value={url} onChange={(e) => { setUrl(e.target.value); setPendingUrl(null); setUrlErr(null); }} placeholder={cloudUrl()} />
            <button disabled={busy} onClick={saveUrl}>Enregistrer</button>
          </div>
        </label>
        {urlErr && <div className="error" role="alert">{urlErr}</div>}
        {insecure && <p className="muted" role="note">⚠ Connexion non chiffrée (http) : mot de passe et jetons circulent en clair. À n’utiliser que sur un réseau local de confiance.</p>}
        {pendingUrl && (
          <div className="error" role="alert">
            Changer de serveur vous déconnectera de {sessionUrl()}.
            <div className="sim-row">
              <button disabled={busy} onClick={() => setPendingUrl(null)}>Annuler</button>
              <button className="primary" disabled={busy} onClick={confirmUrlChange}>Se déconnecter et changer</button>
            </div>
          </div>
        )}
        </section>
        <section className="context-panel"><span className="workspace-kicker">SANS COMPTE</span><h2>Télécommande directe</h2>
          <p className="muted">
            Permet à l’application Android de lancer vos profils sans compte. Attention : toute personne qui peut
            joindre ce serveur peut alors voir vos profils et les déclencher. À n’activer que sur un réseau de confiance.
            {signedIn && " Indisponible tant que vous êtes connecté : votre compte est utilisé à la place."}
          </p>
          <div className="density-options">
            <button className="btn-secondary" aria-pressed={!direct} disabled={busy} onClick={() => toggleDirect(false)}>Désactivée</button>
            <button className="btn-secondary" aria-pressed={direct} disabled={busy || signedIn || !IS_DESKTOP} onClick={() => toggleDirect(true)}>Activée</button>
          </div>
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

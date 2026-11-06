import { useEffect, useState } from "react";
import { api, IS_DESKTOP, onVoiceEvent, type VoiceStatus } from "../api";

/** "Ctrl+Shift+Space" or "⌘⇧Space", depending on the platform. */
function shortcutLabel(shortcut: string): string {
  const mac = navigator.platform.toLowerCase().includes("mac");
  return mac ? shortcut.replace("CmdOrCtrl+", "⌘").replace("Shift+", "⇧") : shortcut.replace("CmdOrCtrl", "Ctrl");
}

/** Voice command settings: model download and a hold-to-talk test button. */
export default function VoiceSettings() {
  const [status, setStatus] = useState<VoiceStatus | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!IS_DESKTOP) return;
    api.voiceStatus().then(setStatus).catch((e) => setErr(String(e)));
    let unlisten: (() => void) | undefined;
    onVoiceEvent((e) => {
      if (e.state === "download" && e.total) setProgress(Math.round((e.downloaded / e.total) * 100));
    }).then((fn) => (unlisten = fn));
    return () => unlisten?.();
  }, []);

  function download() {
    setErr(null);
    setProgress(0);
    api
      .voiceDownloadModel()
      .then(() => api.voiceStatus().then(setStatus))
      .catch((e) => setErr(String(e)))
      .finally(() => setProgress(null));
  }

  const talk = (on: boolean) => (on ? api.voiceStart() : api.voiceStop()).catch((e) => setErr(String(e)));

  return (
    <section className="context-panel">
      <span className="workspace-kicker">COMMANDE VOCALE</span>
      <h2>Lancer un profil à la voix</h2>
      <p className="muted">
        Maintenez le raccourci, dites par exemple « lance le mode Gaming », puis relâchez. La voix est transcrite
        sur cet appareil : rien n’est envoyé en ligne.
      </p>
      {!IS_DESKTOP || !status ? (
        <p className="muted">Disponible dans l’application de bureau.</p>
      ) : !status.supported ? (
        <p className="muted">Cette version a été compilée sans la commande vocale.</p>
      ) : !status.model_ready ? (
        <div className="sim-row">
          <button className="primary" disabled={progress !== null} onClick={download}>
            {progress === null ? "Télécharger le modèle vocal (≈ 150 Mo)" : `Téléchargement… ${progress} %`}
          </button>
        </div>
      ) : (
        <>
          <dl className="system-facts">
            <div><dt>Raccourci</dt><dd><kbd>{shortcutLabel(status.shortcut)}</kbd> (maintenir)</dd></div>
            <div><dt>Modèle</dt><dd>Whisper base, local</dd></div>
          </dl>
          <div className="sim-row">
            <button
              className="btn-secondary"
              onPointerDown={() => talk(true)}
              onPointerUp={() => talk(false)}
              onPointerLeave={(e) => e.buttons && talk(false)}
            >
              Maintenir pour parler
            </button>
          </div>
        </>
      )}
      {err && <div className="error">{err}</div>}
    </section>
  );
}

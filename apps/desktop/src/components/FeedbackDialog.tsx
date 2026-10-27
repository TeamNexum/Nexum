import { useEffect, useRef, useState } from "react";
import { api } from "../api";
import { cloud } from "../sync";

// Limits mirror services/nexum-cloud/src/feedback.rs.
const MAX_MESSAGE = 4000;
const MAX_SCREENSHOT = 8 * 1024 * 1024;
const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

type Screenshot = { mime: string; data_base64: string; preview: string };

function readImage(file: Blob): Promise<Screenshot> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const url = String(reader.result);
      resolve({ mime: file.type, data_base64: url.slice(url.indexOf(",") + 1), preview: url });
    };
    reader.onerror = () => reject(new Error("Impossible de lire l'image."));
    reader.readAsDataURL(file);
  });
}

/**
 * Beta feedback: a message, an optional screenshot (picked or pasted) and,
 * only if the tester ticks the box, the redacted app logs, which they can read
 * before sending. Reports go through Nexum Cloud, which must be running.
 */
export default function FeedbackDialog({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [message, setMessage] = useState("");
  const [contact, setContact] = useState("");
  const [screenshot, setScreenshot] = useState<Screenshot | null>(null);
  const [includeLogs, setIncludeLogs] = useState(false);
  const [logs, setLogs] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const dialog = ref.current!; dialog.showModal();
    return () => { dialog.close(); if (previous?.isConnected) previous.focus(); };
  }, []);

  async function attach(file: Blob | null | undefined) {
    if (!file) return;
    setErr(null);
    if (!IMAGE_TYPES.includes(file.type)) return setErr("Format non pris en charge : PNG, JPEG, WebP ou GIF.");
    if (file.size > MAX_SCREENSHOT) return setErr("La capture dépasse 8 Mo.");
    try { setScreenshot(await readImage(file)); }
    catch (e) { setErr(String(e instanceof Error ? e.message : e)); }
  }

  function loadLogs() {
    if (logs !== null) return;
    api.feedbackContext(true).then(ctx => setLogs(ctx.logs ?? ""), (e) => setLogs(`Journal indisponible : ${String(e instanceof Error ? e.message : e)}`));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr(null);
    try {
      const { version, os, logs } = await api.feedbackContext(includeLogs);
      await cloud.sendFeedback({
        message: message.trim(),
        contact: contact.trim() || null,
        version,
        os,
        screenshot: screenshot && { mime: screenshot.mime, data_base64: screenshot.data_base64 },
        logs,
      });
      setSent(true);
    } catch (error) {
      // The form keeps its content so the tester can simply retry.
      setErr(String(error instanceof Error ? error.message : error));
    } finally { setBusy(false); }
  }

  return <dialog ref={ref} className="feedback-dialog" aria-labelledby="feedback-title"
    onCancel={e => { e.preventDefault(); if (!busy) onClose(); }}
    onPaste={e => { const item = [...e.clipboardData.items].find(i => i.type.startsWith("image/")); if (item) { e.preventDefault(); void attach(item.getAsFile()); } }}>
    <form onSubmit={submit}>
      <header>
        <span className="workspace-kicker">BÊTA</span>
        <h2 id="feedback-title">Envoyer un retour</h2>
        <p className="muted">Un bug, une idée, quelque chose de confus ? L'équipe lit chaque message.</p>
      </header>
      {sent ? <>
        <p className="ok" role="status">Merci ! Votre retour a bien été envoyé.</p>
        <footer><button type="button" className="primary" onClick={onClose}>Fermer</button></footer>
      </> : <>
        <label className="field">
          Votre message
          <textarea required autoFocus rows={6} maxLength={MAX_MESSAGE} value={message} onChange={e => setMessage(e.target.value)}
            placeholder="Ce que vous faisiez, ce qui s'est passé, ce que vous attendiez…" />
        </label>
        <div className="field">
          Capture d’écran (facultatif)
          {screenshot
            ? <div className="feedback-shot"><img src={screenshot.preview} alt="Aperçu de la capture jointe" /><button type="button" className="btn-secondary" onClick={() => setScreenshot(null)}>Retirer</button></div>
            : <><input type="file" aria-label="Choisir une capture d’écran" accept={IMAGE_TYPES.join(",")} onChange={e => void attach(e.target.files?.[0])} /><small className="muted">ou collez une image ici (Ctrl V)</small></>}
        </div>
        <label className="feedback-consent">
          <input type="checkbox" checked={includeLogs} onChange={e => setIncludeLogs(e.target.checked)} />
          <span>Joindre le journal de l'application<small>Il aide à comprendre un bug. Mots de passe, jetons et identifiants Hue en sont retirés.</small></span>
        </label>
        {includeLogs && <details onToggle={e => { if (e.currentTarget.open) loadLogs(); }}>
          <summary>Voir le journal qui sera envoyé</summary>
          <pre className="feedback-logs">{logs ?? "Chargement…"}</pre>
        </details>}
        <label className="field">
          Contact (facultatif)
          <input value={contact} onChange={e => setContact(e.target.value)} placeholder="E-mail ou pseudo Discord, pour qu’on puisse vous répondre" />
        </label>
        {err && <div className="error" role="alert">{err}</div>}
        <footer>
          <button type="button" onClick={onClose} disabled={busy}>Annuler</button>
          <button type="submit" className="primary" disabled={busy || !message.trim()}>{busy ? "Envoi…" : "Envoyer"}</button>
        </footer>
      </>}
    </form>
  </dialog>;
}

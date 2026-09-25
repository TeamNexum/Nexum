import { useRef, useState } from "react";
import { api } from "../api";
import type { ImportPreview } from "../types";
import { RISK_LEVEL_LABEL, categoryMeta } from "../modeMeta";

/** Import a `.nexum.json` file shared by someone else, after a risk review. */
export default function ImportMode({ onImported }: { onImported: () => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [contents, setContents] = useState<string | null>(null);
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setContents(null);
    setPreview(null);
    if (input.current) input.current.value = "";
  }

  async function pick(file: File | undefined) {
    if (!file) return;
    reset();
    setMsg(null);
    setError(null);
    try {
      const text = await file.text();
      setPreview(await api.previewImport(text));
      setContents(text);
    } catch (e) {
      setError(String(e instanceof Error ? e.message : e));
    }
  }

  async function confirm() {
    if (contents === null) return;
    setBusy(true);
    setError(null);
    try {
      const mode = await api.importMode(contents);
      reset();
      onImported();
      setMsg(`« ${mode.name} » ajouté à votre bibliothèque.`);
    } catch (e) {
      setError(String(e instanceof Error ? e.message : e));
    } finally {
      setBusy(false);
    }
  }

  const risk = preview?.risk;
  const rejected = risk?.level === "rejected";

  return (
    <section className="block">
      <h2>Importer un profil</h2>
      <p className="muted">
        Ajoutez un profil partagé sous forme de fichier <code>.nexum.json</code>. Son niveau de
        risque est évalué avant l’import ; rien ne s’exécute avant l’activation.
      </p>
      <input ref={input} type="file" accept=".json,application/json" hidden aria-label="Fichier de profil"
        onChange={e => void pick(e.target.files?.[0])} />
      <button className="btn-secondary" disabled={busy} onClick={() => input.current?.click()}>
        Choisir un fichier…
      </button>

      {preview && risk && (
        <div className="risk">
          <div className={`risk-badge ${risk.level}`}>{risk.level.toUpperCase()}</div>
          <p>
            <b>{preview.mode.name}</b> · {categoryMeta(preview.mode.category).label} ·{" "}
            {preview.mode.steps.length} actions
          </p>
          <p>{RISK_LEVEL_LABEL[risk.level]}</p>
          <p>
            Score de risque : <b>{risk.score}</b>
          </p>
          {risk.unknown_actions.length > 0 && (
            <div className="fail">Actions inconnues : {risk.unknown_actions.join(", ")}</div>
          )}
          {risk.issues.length > 0 && (
            <ul>
              {risk.issues.map((issue, i) => (
                <li key={i}>⚠ {issue}</li>
              ))}
            </ul>
          )}
          <div className="sim-row">
            <button className="btn-secondary" disabled={busy} onClick={reset}>Annuler</button>
            <button className="primary" disabled={busy || rejected} onClick={() => void confirm()}>
              {busy ? "Import…" : risk.level === "high" ? "Importer malgré le risque" : "Importer"}
            </button>
          </div>
        </div>
      )}

      {msg && <div className="ok" role="status">{msg}</div>}
      {error && <div className="error" role="alert">{error}</div>}
    </section>
  );
}

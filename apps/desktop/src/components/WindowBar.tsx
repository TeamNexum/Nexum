import { useEffect, useState } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { IS_DESKTOP } from "../api";

export default function WindowBar() {
  const [maximized, setMaximized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!IS_DESKTOP) return;
    const window = getCurrentWindow();
    let disposed = false;
    let unlisten: (() => void) | undefined;
    const update = async () => {
      const value = await window.isMaximized();
      if (!disposed) setMaximized(value);
    };
    const failed = () => { if (!disposed) setError("Impossible de lire l’état de la fenêtre."); };
    void update().catch(failed);
    void window.onResized(() => { void update().catch(failed); }).then(fn => {
      if (disposed) fn();
      else unlisten = fn;
    }).catch(failed);
    return () => { disposed = true; unlisten?.(); };
  }, []);

  if (!IS_DESKTOP) return null;

  async function act(action: "minimize" | "toggleMaximize" | "close" | "startDragging") {
    try {
      setError(null);
      await getCurrentWindow()[action]();
    } catch {
      setError("Impossible de modifier la fenêtre. Réessayez.");
    }
  }

  return (
    <>
      <div className="window-bar">
        <div className="window-drag-area"
          onMouseDown={event => {
            if (event.button === 0 && event.detail === 1) void act("startDragging");
          }}
          onDoubleClick={() => void act("toggleMaximize")}
        ><span>Nexum</span></div>
        <div className="window-controls" aria-label="Commandes de la fenêtre">
          <button aria-label="Réduire la fenêtre" title="Réduire" onClick={() => void act("minimize")}>
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M1 6h10" /></svg>
          </button>
          <button aria-label={maximized ? "Restaurer la fenêtre" : "Agrandir la fenêtre"} title={maximized ? "Restaurer" : "Agrandir"} onClick={() => void act("toggleMaximize")}>
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">{maximized ? <path d="M4 3V1h7v7H9M1 4h7v7H1z" /> : <rect x="1.5" y="1.5" width="9" height="9" />}</svg>
          </button>
          <button className="window-close" aria-label="Fermer la fenêtre" title="Fermer" onClick={() => void act("close")}>
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="m2 2 8 8m0-8-8 8" /></svg>
          </button>
        </div>
      </div>
      {error && <div className="window-error" role="alert">{error}</div>}
    </>
  );
}

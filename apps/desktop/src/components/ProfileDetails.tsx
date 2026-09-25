import { useEffect, useRef } from "react";
import type { Mode } from "../types";
import { actionMeta, categoryMeta, describeStep } from "../modeMeta";
import ProfileArtwork from "./ProfileArtwork";

export default function ProfileDetails({ mode, onClose, onAction, actionLabel, busy, onEdit, onExport, favorite, onFavorite, onMove, canMoveLeft, canMoveRight, error, status, actionDisabled }: {
  mode: Mode; onClose: () => void; onAction: () => void; actionLabel: string; busy: boolean;
  onEdit?: () => void; onExport?: () => void; favorite?: boolean; onFavorite?: () => void;
  onMove?: (direction: -1 | 1) => void; canMoveLeft?: boolean; canMoveRight?: boolean; error?: string | null;
  status?: string | null;
  actionDisabled?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current!;
    const previous = document.activeElement as HTMLElement | null;
    dialog.showModal();
    return () => { dialog.close(); if (previous?.isConnected) previous.focus(); };
  }, []);
  const steps = [...mode.steps].sort((a, b) => a.order - b.order);
  return <dialog ref={ref} className="profile-drawer" aria-labelledby="profile-detail-title"
    onCancel={e => { e.preventDefault(); onClose(); }}
    onClick={e => { if (e.target === e.currentTarget) { const b = e.currentTarget.getBoundingClientRect(); if (e.clientX < b.left || e.clientX > b.right || e.clientY < b.top || e.clientY > b.bottom) onClose(); } }}>
    <div className="drawer-heading"><span className="workspace-kicker">APERÇU DU PROFIL</span><button autoFocus className="btn-secondary" aria-label="Fermer les détails" onClick={onClose}>×</button></div>
    <div className="drawer-body">
      <ProfileArtwork category={mode.category} />
      <div className="drawer-title"><div><span className="workspace-kicker">{categoryMeta(mode.category).label}</span><h2 id="profile-detail-title">{mode.name}</h2></div>
        {onFavorite && <button className="favorite-button" aria-label={favorite ? "Retirer des favoris" : "Ajouter aux favoris"} aria-pressed={favorite} onClick={onFavorite}>{favorite ? "★" : "☆"}</button>}
      </div>
      {mode.description && <p className="muted">{mode.description}</p>}
      <div className="drawer-section-heading"><h3>À l’activation</h3><span>{steps.filter(s => s.enabled).length} actions actives</span></div>
      <ol className="profile-action-preview">{steps.map((step, index) => {
        const meta = actionMeta(step.type); const Icon = meta.Icon;
        return <li key={`${step.order}-${index}`} className={step.enabled ? "" : "disabled"}><span className="preview-step-icon"><Icon size={18} /></span><div><strong>{meta.label}</strong><p>{describeStep(step)}</p><small>{step.enabled ? (step.on_error === "continue" ? "En cas d’échec : continuer" : "En cas d’échec : arrêter") : "Désactivée — ne sera pas exécutée"}</small></div></li>;
      })}</ol>
      {steps.length === 0 && <p className="muted">Ce profil ne contient aucune action.</p>}
      {onMove && <div className="drawer-order"><span>Position {favorite ? "dans les favoris" : "dans la bibliothèque"}</span><div><button className="btn-secondary" disabled={!canMoveLeft} onClick={() => onMove(-1)} aria-label="Déplacer le profil avant">←</button><button className="btn-secondary" disabled={!canMoveRight} onClick={() => onMove(1)} aria-label="Déplacer le profil après">→</button></div></div>}
      {error && <p role="alert" className="error">{error}</p>}
      {status && <p role="status" className="muted">{status}</p>}
    </div>
    <footer className="drawer-footer">{onExport && <button className="btn-secondary" disabled={busy} onClick={onExport}>Exporter</button>}{onEdit && <button className="btn-secondary" disabled={busy} onClick={onEdit}>Modifier dans le Studio</button>}<button className="primary" disabled={busy || actionDisabled} onClick={onAction}>{busy ? "En cours…" : actionLabel}</button></footer>
  </dialog>;
}

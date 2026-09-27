import { useEffect, useState, useRef } from "react";
import { api } from "../api";
import type { ExecutionReport, Mode } from "../types";
import {
  STARTER_TEMPLATES,
  describeStep,
  toMode,
  type CatalogMode,
} from "../modeMeta";
import {
  IconAlert,
  IconCheck,
  IconPlus,
  IconPlay,
} from "./Icons";
import { runHeadline, summarize, type RunSummary } from "../stepStatus";
import ProfileArtwork from "./ProfileArtwork";
import ProfileDetails from "./ProfileDetails";

interface Toast {
  name: string;
  summary: RunSummary;
}

/** ok = all good, warn = some steps skipped, fail = at least one step failed. */
function toastLevel(s: RunSummary): "ok" | "warn" | "fail" {
  if (s.failed > 0) return "fail";
  return s.unavailable > 0 ? "warn" : "ok";
}

export default function Dashboard({
  modes,
  activeModeId,
  reload,
  favorites, onFavorite, onMove, onEdit,
}: {
  modes: Mode[];
  activeModeId: string | null;
  reload: () => void;
  favorites: string[]; onFavorite: (id: string) => void; onMove: (id: string, targetId: string) => void; onEdit: (id: string) => void;
}) {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const [addingName, setAddingName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [exportStatus, setExportStatus] = useState<string | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [selected, setSelected] = useState<{ id: string } | { template: CatalogMode } | null>(null);
  const dragId = useRef<string | null>(null);
  const selectedMode = selected && ("id" in selected ? modes.find(m => m.id === selected.id) : toMode(selected.template, "template-preview"));
  const group = selectedMode ? modes.filter(m => favorites.includes(m.id) === favorites.includes(selectedMode.id)) : [];
  const position = group.findIndex(m => m.id === selectedMode?.id);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!toast) return;
    // Leave problems on screen long enough to read the reason.
    const clean = toast.summary.failed + toast.summary.unavailable === 0;
    const t = setTimeout(() => setToast(null), clean ? 3200 : 7000);
    return () => clearTimeout(t);
  }, [toast]);

  const active = modes.find((m) => m.id === activeModeId) ?? null;
  
  async function activate(mode: Mode) {
    if (pendingId !== null) return;
    setError(null);
    setPendingId(mode.id);
    try {
      const report: ExecutionReport = await api.activateMode(mode.id);
      setToast({ name: mode.name, summary: summarize(report) });
    } catch (e) {
      const total = mode.steps.length;
      setToast({ name: mode.name, summary: { total, ok: 0, failed: total, unavailable: 0, firstProblem: null } });
      setError(String(e instanceof Error ? e.message : e));
    } finally {
      setPendingId(null);
    }
  }

  async function exportMode(mode: Mode) {
    setError(null);
    setExportStatus(null);
    try {
      const path = await api.exportMode(mode.id);
      if (path) setExportStatus(`Profil exporté vers ${path}`);
    } catch (e) {
      setError(String(e instanceof Error ? e.message : e));
    }
  }

  async function addTemplate(tpl: CatalogMode) {
    setAddingName(tpl.name);
    setError(null);
    try {
      const id = await api.newId();
      await api.saveMode(toMode(tpl, id));
      reload();
      setSelected(null);
    } catch (e) {
      setError(String(e instanceof Error ? e.message : e));
    } finally {
      setAddingName(null);
    }
  }

  const templatesToOffer = STARTER_TEMPLATES.filter(
    (t) => !modes.some((m) => m.name.toLowerCase() === t.name.toLowerCase()),
  );

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const update = () => {
      setCanScrollLeft(carousel.scrollLeft > 2);
      setCanScrollRight(carousel.scrollLeft + carousel.clientWidth < carousel.scrollWidth - 2);
    };
    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || Math.abs(event.deltaY) <= Math.abs(event.deltaX) || carousel.scrollWidth <= carousel.clientWidth) return;
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? carousel.clientWidth : 1;
      const delta = event.deltaY * unit;
      const max = carousel.scrollWidth - carousel.clientWidth;
      if ((delta < 0 && carousel.scrollLeft <= 1) ||
          (delta > 0 && carousel.scrollLeft >= max - 1)) return;
      event.preventDefault();
      carousel.scrollLeft = Math.max(0, Math.min(max, carousel.scrollLeft + delta));
    };
    const observer = new ResizeObserver(update);
    observer.observe(carousel);
    carousel.addEventListener("scroll", update, { passive: true });
    carousel.addEventListener("wheel", onWheel, { passive: false });
    update();
    return () => {
      observer.disconnect();
      carousel.removeEventListener("scroll", update);
      carousel.removeEventListener("wheel", onWheel);
    };
  }, [modes.length, templatesToOffer.length]);

  const scrollCarousel = (direction: -1 | 1) => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    carousel.scrollBy({ left: direction * Math.max(240, carousel.clientWidth * 0.7), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  return (
    <section className="profile-library" aria-labelledby="profiles-title">
      <div className="library-header">
        <div>
          <h1 id="profiles-title" className="library-title">Vos profils</h1>
          <p className="library-description">{active ? `${active.name} est actif. Changez de profil à tout moment.` : "Votre environnement, prêt en un geste."}</p>
        </div>
        <div className="carousel-controls" aria-label="Navigation des profils">
          <span className="carousel-count">{modes.length} profil{modes.length > 1 ? "s" : ""}</span>
          <button type="button" aria-label="Profils précédents" disabled={!canScrollLeft} onClick={() => scrollCarousel(-1)}>←</button>
          <button type="button" aria-label="Profils suivants" disabled={!canScrollRight} onClick={() => scrollCarousel(1)}>→</button>
        </div>
      </div>

      {error && <div className="error dashboard-error" role="alert">{error}</div>}

      <div className="cinematic-carousel" ref={carouselRef} tabIndex={0} aria-label="Profils et modèles disponibles"
        onKeyDown={event => {
          const target = event.target as HTMLElement;
          if (target !== event.currentTarget && !target.matches("[data-profile-entry]")) return;
          if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
          const entries = Array.from(event.currentTarget.querySelectorAll<HTMLElement>("[data-profile-entry]"));
          if (!entries.length) return;
          event.preventDefault();
          const current = entries.indexOf(target);
          const next = event.key === "Home" ? 0 : event.key === "End" ? entries.length - 1 : Math.max(0, Math.min(entries.length - 1, current + (event.key === "ArrowRight" ? 1 : -1)));
          entries[next].focus({ preventScroll: true });
          entries[next].scrollIntoView({ block: "nearest", inline: "nearest", behavior: "instant" });
        }}>
        {modes.map((mode) => {
          const isActive = mode.id === activeModeId;
          const favorite = favorites.includes(mode.id);
          const preview = [...mode.steps].sort((a, b) => a.order - b.order).filter(s => s.enabled).slice(0, 2).map(describeStep).join(" · ");
          return <article key={mode.id} data-mode-id={mode.id} className={`cine-card saved-profile ${isActive ? "active" : ""}`}
            onDragOver={e => { if (dragId.current && favorites.includes(dragId.current) === favorite) e.preventDefault(); }}
            onDrop={e => { e.preventDefault(); if (dragId.current) onMove(dragId.current, mode.id); dragId.current = null; }}>
            <button data-profile-entry className="profile-open" aria-label={`Voir le profil ${mode.name}`} onClick={() => { setError(null); setToast(null); setSelected({ id: mode.id }); }}>
              <ProfileArtwork category={mode.category} />
              <span className="cine-name">{mode.name}</span>
              <span className="cine-steps">{mode.steps.filter(s => s.enabled).length} actions {isActive && <span className="profile-active-label">Actif</span>}</span>
              <span className="profile-mini-preview">{preview || "Aucune action active"}</span>
            </button>
            <div className="profile-card-tools">
              <button className="profile-quick-play" aria-label={`Activer directement ${mode.name}`} title="Activer directement" disabled={pendingId !== null} onClick={() => void activate(mode)}>{pendingId === mode.id ? <span className="spinner-pip" /> : <IconPlay size={14} />}</button>
              <button className="favorite-button" aria-label={`${favorite ? "Retirer" : "Ajouter"} ${mode.name} ${favorite ? "des" : "aux"} favoris`} aria-pressed={favorite} onClick={() => onFavorite(mode.id)}>{favorite ? "★" : "☆"}</button>
              <button className="profile-drag" draggable aria-label={`Réorganiser ${mode.name}`} title="Glisser pour déplacer, ou ouvrir les détails pour utiliser les flèches" onClick={() => { setError(null); setToast(null); setSelected({ id: mode.id }); }} onDragStart={e => { dragId.current = mode.id; e.dataTransfer.setData("text/plain", mode.id); e.dataTransfer.effectAllowed = "move"; }} onDragEnd={() => { dragId.current = null; }}>⠿</button>
            </div>
          </article>;
        })}

        {/* Quick Add Cards in the Carousel */}
        {templatesToOffer.map((t) => {
          const isBusy = addingName === t.name;

          return (
            <div 
              key={t.name} 
              className="cine-card starter"
              data-profile-entry
              role="button"
              tabIndex={0}
              aria-label={`Voir le modèle ${t.name}`}
              aria-busy={isBusy}
              aria-disabled={isBusy}
              onClick={() => { setError(null); setSelected({ template: t }); }}
              onKeyDown={(e) => {
                if ((e.key === "Enter" || e.key === " ") && !isBusy) {
                  e.preventDefault();
                  setError(null);
                  setSelected({ template: t });
                }
              }}
            >
              <div className="cine-card-content">
                <ProfileArtwork category={t.category} />
                <div className="cine-meta">
                  <h3 className="cine-name">{t.name}</h3>
                  <span className="template-label">Modèle à ajouter</span>
                  <div className="cine-steps">
                    <span>{t.tagline}</span>
                  </div>
                </div>
              </div>
              <div className="cine-action-overlay">
                <span className="btn-cine-play">
                  {isBusy ? <span className="spinner-pip" /> : <IconPlus size={18} />}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {selectedMode && selected && <ProfileDetails mode={selectedMode} onClose={() => { setSelected(null); setExportStatus(null); }}
        busy={pendingId !== null || addingName !== null} error={error}
        status={toast ? `${runHeadline(toast.summary)} · ${toast.summary.ok}/${toast.summary.total} actions réussies` : exportStatus}
        actionLabel={"template" in selected ? "Ajouter à ma bibliothèque" : "Activer ce profil"}
        onAction={() => { if ("template" in selected) void addTemplate(selected.template); else void activate(selectedMode); }}
        onExport={"id" in selected ? () => void exportMode(selectedMode) : undefined}
        onEdit={"id" in selected ? () => { setSelected(null); onEdit(selectedMode.id); } : undefined}
        favorite={favorites.includes(selectedMode.id)}
        onFavorite={"id" in selected ? () => onFavorite(selectedMode.id) : undefined}
        canMoveLeft={position > 0} canMoveRight={position >= 0 && position < group.length - 1}
        onMove={"id" in selected ? direction => { const target = group[position + direction]; if (target) onMove(selectedMode.id, target.id); } : undefined}
      />}
      {/* ACTIVATION TOAST NOTIFICATION */}
      {toast && (
        <div role={toastLevel(toast.summary) === "ok" ? "status" : "alert"} className={`dock-toast ${toastLevel(toast.summary)}`}>
          <div className="toast-icon">
            {toastLevel(toast.summary) === "ok" ? <IconCheck size={16} /> : <IconAlert size={16} />}
          </div>
          <div className="toast-content">
            <span className="toast-title">{toast.name} · {runHeadline(toast.summary)}</span>
            <span className="toast-sub">
              {toast.summary.firstProblem ?? `${toast.summary.ok}/${toast.summary.total} actions réussies`}
            </span>
          </div>
        </div>
      )}
    </section>
  );
}

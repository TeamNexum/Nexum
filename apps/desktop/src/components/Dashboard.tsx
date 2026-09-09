import { useEffect, useState, useMemo, useRef } from "react";
import { api } from "../api";
import type { ExecutionReport, Mode } from "../types";
import {
  categoryMeta,
  catStyle,
  STARTER_TEMPLATES,
  toMode,
  type CatalogMode,
} from "../modeMeta";
import {
  IconPlay,
  IconCheck,
  IconPlus,
} from "./Icons";

interface Toast {
  name: string;
  ok: boolean;
  done: number;
  total: number;
}

export default function Dashboard({
  modes,
  activeModeId,
  reload,
  onResetActive,
}: {
  modes: Mode[];
  activeModeId: string | null;
  reload: () => void;
  onResetActive?: () => void;
}) {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const [addingName, setAddingName] = useState<string | null>(null);
  const [hoveredMode, setHoveredMode] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  // Convert vertical mouse wheel scrolling into horizontal scrolling
  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (carouselRef.current) {
      if (e.deltaY !== 0 && e.deltaX === 0) {
        // Prevent default vertical scrolling if we are mapping to horizontal
        // But since this is a React synthetic event, preventDefault() might throw if passive.
        // Usually, just setting scrollLeft is enough for mouse wheel.
        carouselRef.current.scrollLeft += e.deltaY;
      }
    }
  };

  const active = modes.find((m) => m.id === activeModeId) ?? null;
  
  // Calculate ambient color based on focused or active mode
  const ambientColor = useMemo(() => {
    const focusId = hoveredMode || activeModeId;
    if (!focusId) return 'rgba(255,255,255,0.02)';
    const focusMode = modes.find(m => m.id === focusId);
    if (!focusMode) return 'rgba(255,255,255,0.02)';
    return categoryMeta(focusMode.category).color;
  }, [hoveredMode, activeModeId, modes]);

  async function activate(mode: Mode) {
    setPendingId(mode.id);
    try {
      const report: ExecutionReport = await api.activateMode(mode.id);
      const done = report.steps.filter((s) => s.success).length;
      setToast({ name: mode.name, ok: report.success, done, total: report.steps.length });
    } catch (e) {
      setToast({ name: mode.name, ok: false, done: 0, total: mode.steps.length });
      console.error(e);
    } finally {
      setPendingId(null);
    }
  }

  async function addTemplate(tpl: CatalogMode) {
    setAddingName(tpl.name);
    try {
      const id = await api.newId();
      await api.saveMode(toMode(tpl, id));
      reload();
    } catch (e) {
      console.error(e);
    } finally {
      setAddingName(null);
    }
  }

  const templatesToOffer = STARTER_TEMPLATES.filter(
    (t) => !modes.some((m) => m.name.toLowerCase() === t.name.toLowerCase()),
  );

  return (
    <div className="dashboard-hero">
      <div className="hero-header">
        <span className="hero-eyebrow">Vos Espaces</span>
        <h1 className="hero-title">{active ? active.name : "Sélectionnez un Profil"}</h1>
      </div>

      <div className="cinematic-carousel" ref={carouselRef} onWheel={onWheel}>
        {modes.map((mode) => {
          const cm = categoryMeta(mode.category);
          const isActive = mode.id === activeModeId;
          const isPending = mode.id === pendingId;
          const Icon = cm.Icon;

          return (
            <div
              key={mode.id}
              className={`cine-card ${isActive ? "active" : ""}`}
              onMouseEnter={() => setHoveredMode(mode.id)}
              onMouseLeave={() => setHoveredMode(null)}
              onClick={() => activate(mode)}
            >
              <div className="cine-card-content">
                <div className="cine-icon-stage">
                  <Icon size={140} className="cine-icon" />
                </div>

                <div className="cine-meta">
                  <h3 className="cine-name">{mode.name}</h3>
                  <div className="cine-steps">
                    <span>{mode.steps.length} actions</span>
                    {isActive && (
                      <span style={{ color: 'var(--nx-text)', fontWeight: 700, marginLeft: 'auto' }}>
                        ACTIF
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="cine-action-overlay">
                <button 
                  className="btn-cine-play"
                  disabled={isPending}
                  title={isActive ? "Ré-appliquer" : "Activer"}
                >
                  {isPending ? <span className="spinner-pip" /> : isActive ? <IconCheck size={20} /> : <IconPlay size={20} />}
                </button>
              </div>
            </div>
          );
        })}

        {/* Quick Add Cards in the Carousel */}
        {templatesToOffer.map((t) => {
          const cm = categoryMeta(t.category);
          const Icon = cm.Icon;
          const isBusy = addingName === t.name;

          return (
            <div 
              key={t.name} 
              className="cine-card starter"
              style={{ borderStyle: 'dashed' }}
              onClick={() => !isBusy && addTemplate(t)}
            >
              <div className="cine-card-content">
                <div className="cine-icon-stage" style={{ opacity: 0.5 }}>
                  <Icon size={100} className="cine-icon" />
                </div>
                <div className="cine-meta">
                  <h3 className="cine-name">{t.name}</h3>
                  <div className="cine-steps">
                    <span>{t.tagline}</span>
                  </div>
                </div>
              </div>
              <div className="cine-action-overlay">
                <button className="btn-cine-play" disabled={isBusy}>
                  <IconPlus size={20} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ACTIVATION TOAST NOTIFICATION */}
      {toast && (
        <div className={`dock-toast ${toast.ok ? "ok" : "warn"}`}>
          <div className="toast-icon">
            <IconCheck size={16} color={toast.ok ? "var(--nx-green)" : "var(--nx-orange)"} />
          </div>
          <div className="toast-content">
            <span className="toast-title">{toast.name}</span>
            <span className="toast-sub" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
              {toast.ok ? "Profil activé" : "Erreurs pendant l'activation"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

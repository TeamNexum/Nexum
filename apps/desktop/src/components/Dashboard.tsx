import { useEffect, useState, useRef, type CSSProperties, type MouseEvent as ReactMouseEvent, type ReactNode } from "react";
import { api } from "../api";
import type { ExecutionReport, Mode } from "../types";
import {
  STARTER_TEMPLATES,
  actionMeta,
  categoryMeta,
  describeStep,
  toMode,
  type CatalogMode,
} from "../modeMeta";
import {
  IconAlert,
  IconCheck,
} from "./Icons";
import { runHeadline, summarize, type RunSummary } from "../stepStatus";
import ProfileDetails from "./ProfileDetails";
import PixelGalaxy from "./PixelGalaxy";
import Constellation from "./Constellation";
import ProfileMap, { type MapEntry } from "./ProfileMap";
import { tintOf, tintStyle } from "../galaxyTints";

interface Toast {
  name: string;
  summary: RunSummary;
}

const pad = (n: number) => String(n).padStart(2, "0");
/** One step of the activation chain every 300 ms (guide §08). */
const STEP_MS = 300;

/** ok = all good, warn = some steps skipped, fail = at least one step failed. */
function toastLevel(s: RunSummary): "ok" | "warn" | "fail" {
  if (s.failed > 0) return "fail";
  return s.unavailable > 0 ? "warn" : "ok";
}

/** The title rewrites itself in random characters when the profile changes (guide §08). */
function useScramble(target: string) {
  const [text, setText] = useState(target);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setText(target); return; }
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#+*";
    const total = 14;
    let frame = 0;
    const timer = window.setInterval(() => {
      frame++;
      setText([...target].map((c, i) => (c === " " || i < target.length * frame / total ? c : chars[Math.floor(Math.random() * chars.length)])).join(""));
      if (frame >= total) { window.clearInterval(timer); setText(target); }
    }, 32);
    return () => { window.clearInterval(timer); setText(target); };
  }, [target]);
  return text;
}

export default function Dashboard({
  modes,
  activeModeId,
  reload,
  favorites, onFavorite, onMove, onEdit, children,
}: {
  modes: Mode[];
  activeModeId: string | null;
  reload: () => void;
  favorites: string[]; onFavorite: (id: string) => void; onMove: (id: string, targetId: string) => void; onEdit: (id: string) => void;
  children?: (context: { map: ReactNode }) => ReactNode;
}) {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const [addingName, setAddingName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [exportStatus, setExportStatus] = useState<string | null>(null);
  const [selected, setSelected] = useState<{ id: string } | { template: CatalogMode } | null>(null);
  const [focusedKey, setFocusedKey] = useState<string | null>(null);
  const [run, setRun] = useState<{ id: string; n: number; stamp: number } | null>(null);
  const [highlight, setHighlight] = useState(-1);
  const [kick, setKick] = useState(0);
  const dragId = useRef<string | null>(null);
  const selectedMode = selected && ("id" in selected ? modes.find(m => m.id === selected.id) : toMode(selected.template, "template-preview"));
  const group = selectedMode ? modes.filter(m => favorites.includes(m.id) === favorites.includes(selectedMode.id)) : [];
  const position = group.findIndex(m => m.id === selectedMode?.id);
  const carouselRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const fxRef = useRef<HTMLDivElement>(null);
  const parallax = useRef(0);

  useEffect(() => {
    if (!toast) return;
    // Leave problems on screen long enough to read the reason.
    const clean = toast.summary.failed + toast.summary.unavailable === 0;
    const t = setTimeout(() => setToast(null), clean ? 3200 : 7000);
    return () => clearTimeout(t);
  }, [toast]);

  // The chain advances one step per 300 ms while a profile starts, then the real state takes over.
  useEffect(() => {
    if (!run) return;
    const steps = modes.find(m => m.id === run.id)?.steps.filter(s => s.enabled).length ?? 0;
    const timer = window.setInterval(() => setRun(r => (r && r.stamp === run.stamp ? (r.n >= steps ? null : { ...r, n: r.n + 1 }) : r)), STEP_MS);
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run?.stamp]);

  async function activate(mode: Mode) {
    if (pendingId !== null) return;
    setError(null);
    setPendingId(mode.id);
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) setRun({ id: mode.id, n: 0, stamp: Date.now() });
    try {
      const report: ExecutionReport = await api.activateMode(mode.id);
      setToast({ name: mode.name, summary: summarize(report) });
    } catch (e) {
      const total = mode.steps.length;
      setToast({ name: mode.name, summary: { total, ok: 0, failed: total, unavailable: 0, firstProblem: null } });
      setError(String(e instanceof Error ? e.message : e));
      setRun(null);
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
      setFocusedKey(id);
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
  const profileEntries = [
    ...modes.map(mode => ({ key: mode.id, mode, template: null as CatalogMode | null })),
    ...templatesToOffer.map(template => ({ key: `template:${template.name}`, mode: null as Mode | null, template })),
  ];
  const currentKey = profileEntries.some(entry => entry.key === focusedKey)
    ? focusedKey : activeModeId && profileEntries.some(entry => entry.key === activeModeId)
      ? activeModeId : profileEntries[0]?.key;
  const focusedEntry = profileEntries.find(entry => entry.key === currentKey);
  const focusedMode = focusedEntry?.mode ?? (focusedEntry?.template ? toMode(focusedEntry.template, "template-preview") : null);
  const focusedIsActive = !!focusedEntry?.mode && focusedEntry.mode.id === activeModeId;
  const focusedSteps = focusedMode?.steps.filter(step => step.enabled).sort((a, b) => a.order - b.order) ?? [];
  const focusedDomains = [...new Set(focusedSteps.map(step => actionMeta(step.type).domain))];
  const FocusIcon = focusedMode ? categoryMeta(focusedMode.category).Icon : null;
  const focusedIndex = profileEntries.findIndex(entry => entry.key === currentKey);
  const focusedTint = tintOf(focusedMode?.category);
  const activeMode = modes.find(m => m.id === activeModeId);
  const activeTint = tintOf(activeMode?.category ?? focusedMode?.category);
  const running = !!run && run.id === focusedMode?.id;
  const phase = running ? "run" : focusedIsActive ? "lit" : "idle";
  const litCount = phase === "lit" ? focusedSteps.length : phase === "run" ? Math.min(run!.n, focusedSteps.length) : 0;
  const progress = pendingId !== null && run ? Math.min(100, Math.round((run.n / (focusedSteps.length + 1)) * 100)) : pendingId !== null ? 100 : 0;
  const title = useScramble(focusedMode?.name ?? "");

  const firstTemplateIndex = profileEntries.findIndex(entry => entry.template);
  const mapEntries: MapEntry[] = profileEntries.map(entry => ({ key: entry.key, name: (entry.mode ?? entry.template!).name, tint: tintOf((entry.mode ?? entry.template!).category), template: !!entry.template }));

  // Profile change: the galaxy turns and flashes, the page keeps one tint (guide §08).
  const previousKey = useRef(currentKey);
  useEffect(() => {
    if (previousKey.current === currentKey) return;
    previousKey.current = currentKey;
    setHighlight(-1);
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) setKick(k => k + 1);
  }, [currentKey]);

  useEffect(() => {
    const centerSelection = () => {
      const carousel = carouselRef.current;
      const selected = carousel?.querySelector<HTMLElement>(".galaxy-rail-item.focused");
      if (!carousel || !selected) return;
      const track = carousel.getBoundingClientRect();
      const node = selected.getBoundingClientRect();
      carousel.scrollLeft += node.left - track.left - (track.width - node.width) / 2;
    };
    centerSelection();
    // The selected card widens over 0.28 s; centre again once it has settled.
    const settle = window.setTimeout(centerSelection, 300);
    window.addEventListener("resize", centerSelection);
    return () => { window.clearTimeout(settle); window.removeEventListener("resize", centerSelection); };
  }, [currentKey]);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
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
    carousel.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      carousel.removeEventListener("wheel", onWheel);
    };
  }, [modes.length, templatesToOffer.length]);

  const navigateFocus = (direction: -1 | 1) => {
    const next = Math.max(0, Math.min(profileEntries.length - 1, focusedIndex + direction));
    setFocusedKey(profileEntries[next].key);
  };

  // Keyboard on the bare page: arrows browse profiles, F toggles the favourite.
  const shortcut = useRef<(event: KeyboardEvent) => void>(() => {});
  shortcut.current = event => {
    if (event.target !== document.body || event.ctrlKey || event.metaKey || event.altKey || document.querySelector("dialog[open]")) return;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") { event.preventDefault(); navigateFocus(1); }
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") { event.preventDefault(); navigateFocus(-1); }
    else if ((event.key === "f" || event.key === "F") && focusedEntry?.mode) onFavorite(focusedEntry.mode.id);
  };
  useEffect(() => {
    const listener = (event: KeyboardEvent) => shortcut.current(event);
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);

  const moveStage = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Move the galaxy directly: writing a CSS variable on the stage would restyle its whole subtree on every mouse move.
    const stage = stageRef.current, fx = fxRef.current;
    if (!stage || !fx || parallax.current) return;
    const { clientX, clientY } = event;
    parallax.current = requestAnimationFrame(() => {
      parallax.current = 0;
      const bounds = stage.getBoundingClientRect();
      fx.style.transform = `translate(${(((clientX - bounds.left) / bounds.width - 0.5) * -8).toFixed(1)}px, ${(((clientY - bounds.top) / bounds.height - 0.5) * -6).toFixed(1)}px)`;
    });
  };

  const launchLabel = focusedEntry?.template ? "Ajouter à ma bibliothèque" : focusedIsActive ? "Relancer ce profil" : "Activer ce profil";
  const launchHint = pendingId !== null || addingName !== null ? `Lancement… ${progress} %` : focusedEntry?.template ? "Un point de départ à personnaliser" : focusedIsActive ? "Chaîne exécutée" : `${pad(focusedSteps.length)} étapes en séquence`;
  const stateLabel = focusedEntry?.template ? "Modèle" : focusedIsActive ? "Profil actif" : "Profil enregistré";
  const isFavorite = !!focusedMode && favorites.includes(focusedMode.id);

  return (
    <section className="galaxy-library" aria-labelledby="profiles-title" style={tintStyle(focusedTint, activeTint)}>
      <div className="galaxy-library-heading">
        <div><div className="lab galaxy-kicker">NEXUM / VOTRE UNIVERS</div><h1 id="profiles-title">Vos profils</h1></div>
        <span className="galaxy-library-count">{pad(modes.length)} profils enregistrés</span>
      </div>

      {error && <div className="error dashboard-error" role="alert">{error}</div>}

      <div className="deck panel">
        <div className="deck-h lab galaxy-rail-heading"><span>Parcourir les profils</span><div className="carousel-controls st" aria-label="Navigation des profils"><button type="button" aria-label="Profil précédent" disabled={focusedIndex <= 0} onClick={() => navigateFocus(-1)}>←</button><button type="button" aria-label="Profil suivant" disabled={focusedIndex >= profileEntries.length - 1} onClick={() => navigateFocus(1)}>→</button></div></div>
        <div className="rowc galaxy-rail" ref={carouselRef} aria-label="Profils et modèles disponibles" onKeyDown={event => {
          if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
          const entries = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>("[data-profile-entry]"));
          const current = entries.indexOf(event.target as HTMLButtonElement);
          if (current < 0) return;
          event.preventDefault();
          const forward = event.key === "ArrowRight" || event.key === "ArrowDown";
          const next = event.key === "Home" ? 0 : event.key === "End" ? entries.length - 1 : Math.max(0, Math.min(entries.length - 1, current + (forward ? 1 : -1)));
          entries[next].focus(); entries[next].click(); entries[next].scrollIntoView({ block: "nearest", inline: "nearest" });
        }}>
          {profileEntries.map((entry, index) => {
            const item = entry.mode ?? entry.template!;
            const Icon = categoryMeta(item.category).Icon;
            const favorite = !!entry.mode && favorites.includes(entry.mode.id);
            const stepCount = entry.mode?.steps.filter(step => step.enabled).length ?? entry.template?.steps.length ?? 0;
            const focused = entry.key === currentKey;
            return <span className="rail-slot" key={entry.key}>
              {index === 0 && <span className="gt" aria-hidden="true">Mes profils · {pad(modes.length)}</span>}
              {index === firstTemplateIndex && <span className="gt m" aria-hidden="true">Modèles · {pad(templatesToOffer.length)}</span>}
              <button type="button" data-profile-entry data-mode-id={entry.mode?.id} className={`galaxy-rail-item cd ${focused ? "focused" : ""}`} style={{ "--c": tintOf(item.category).join(",") } as CSSProperties}
                aria-pressed={focused} aria-current={focused ? "true" : undefined} aria-label={`${entry.template ? "Voir le modèle" : "Afficher le profil"} ${item.name}`}
                draggable={!!entry.mode} title={entry.mode ? "Glisser pour réorganiser" : undefined}
                onClick={() => setFocusedKey(entry.key)}
                onDragStart={event => { if (entry.mode) { dragId.current = entry.mode.id; event.dataTransfer.setData("text/plain", entry.mode.id); event.dataTransfer.effectAllowed = "move"; } }}
                onDragEnd={() => { dragId.current = null; }}
                onDragOver={event => { if (entry.mode && dragId.current && favorites.includes(dragId.current) === favorite) event.preventDefault(); }}
                onDrop={event => { event.preventDefault(); if (entry.mode && dragId.current) onMove(dragId.current, entry.mode.id); dragId.current = null; }}>
                <span className="top"><span className="ic galaxy-rail-symbol"><Icon size={18} /></span>{entry.template ? <span className="add">+</span> : entry.mode?.id === activeModeId ? <span className="tag galaxy-rail-active">Actif</span> : null}</span>
                <span className="galaxy-rail-label"><b>{item.name}{favorite && <i className="fv"> ★</i>}</b><small>{stepCount} actions</small><small className="ds">{item.description || (entry.template ? entry.template.tagline : "")}</small></span>
                <span className="dots" aria-hidden="true">{Array.from({ length: Math.min(stepCount, 8) }, (_, i) => <i key={i} />)}</span>
              </button>
            </span>;
          })}
        </div>
      </div>

      {focusedMode && focusedEntry && FocusIcon && <div className={`stage panel galaxy-focus${phase === "lit" ? " is-active" : ""}`} ref={stageRef} data-category={focusedMode.category} onMouseMove={moveStage}>
        <div className="vis galaxy-visual">
          <div className="fx" ref={fxRef}><PixelGalaxy tint={focusedTint} kick={kick} /></div>
          <Constellation name={focusedMode.name} items={focusedSteps.map(step => ({ domain: actionMeta(step.type).domain, text: describeStep(step) }))} phase={phase} highlight={highlight} onHighlight={setHighlight} />
          <div className="cap">Constellation · {focusedMode.name}</div>
          <div className="tele">{pad(focusedSteps.length)} nœuds · ordre 01→{pad(focusedSteps.length)}</div>
          <div className={`state galaxy-visual-caption${focusedIsActive ? " active" : ""}`}>{stateLabel}</div>
          <div className="hintv">Survolez un nœud</div>
        </div>

        <div className="info galaxy-focus-copy" key={`copy:${currentKey}`}>
          <div className="i-l">
            <div className="pos galaxy-focus-index"><span className="seg" aria-hidden="true">{profileEntries.map((entry, i) => <i key={entry.key} className={i === focusedIndex ? "on" : ""} />)}</span><span>{pad(focusedIndex + 1)} / {pad(profileEntries.length)}</span></div>
            <div className="ttl"><span className="chipi"><FocusIcon size={24} /></span><h2 aria-label={focusedMode.name}>{title}</h2></div>
            <p className="desc galaxy-focus-description">{focusedMode.description || focusedEntry.template?.tagline || "Un environnement prêt à activer."}</p>
          </div>
          <div className="i-r">
            <div className="lab galaxy-action-heading">{pad(focusedDomains.length)} systèmes reliés</div>
            <div className="sys galaxy-action-list">{focusedDomains.map(domain => <span key={domain}>{domain}</span>)}{focusedDomains.length === 0 && <span>Aucun système relié</span>}</div>
            <div className={`dock${focusedEntry.mode ? "" : " two"}`}>
              <button className="launch galaxy-primary-action" style={{ "--p": `${progress}%` } as CSSProperties} data-busy={pendingId !== null || addingName !== null ? "true" : undefined} aria-label={launchLabel} disabled={pendingId !== null || addingName !== null}
                onClick={() => focusedEntry.template ? void addTemplate(focusedEntry.template) : focusedEntry.mode && void activate(focusedEntry.mode)}>
                <span className="fill" aria-hidden="true" />
                <span className="lt">
                  <span className="pl" aria-hidden="true">{focusedEntry.template ? <svg viewBox="0 0 24 24"><path d="M10 4h4v6h6v4h-6v6h-4v-6H4v-4h6z" /></svg> : <svg viewBox="0 0 24 24"><path d="M7 5l12 7-12 7z" /></svg>}</span>
                  <span className="tx"><span className="l1">{launchLabel}</span><span className="l2">{launchHint}</span></span>
                </span>
              </button>
              {focusedEntry.mode && <button className="ib galaxy-favorite-action" aria-label={`${isFavorite ? "Retirer" : "Ajouter"} ${focusedMode.name} ${isFavorite ? "des" : "aux"} favoris`} aria-pressed={isFavorite} title="Favori (F)" onClick={() => onFavorite(focusedMode.id)}>
                <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M6 .5l1.6 3.9L11.5 6 7.6 7.6 6 11.5 4.4 7.6.5 6l3.9-1.6z" /></svg><kbd>F</kbd>
              </button>}
              <button className="ib galaxy-detail-action" aria-label="Voir les détails" title="Voir les détails" onClick={() => setSelected(focusedEntry.template ? { template: focusedEntry.template } : { id: focusedMode.id })}>
                <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 9l6-6M4 3h5v5" /></svg>
              </button>
            </div>
          </div>
        </div>

        <div className="chain galaxy-profile-topology" aria-label={`Chaîne d’activation de ${focusedMode.name}`}>
          <div className="lab galaxy-topology-heading"><span>Chaîne d’activation</span><b>{pad(focusedSteps.length)} ÉTAPES</b></div>
          <div className="pipe">
            <div className={`pipe-origin${phase !== "idle" ? " on" : ""}`}>
              <span className="pn">00</span><span className="ic"><FocusIcon size={16} /></span><b>{focusedMode.name}</b><small>Point de départ</small>
            </div>
            {focusedSteps.length > 0 ? <ol className="galaxy-topology-flow" key={`${currentKey}:${run?.stamp ?? 0}`}>
              {focusedSteps.map((step, index) => {
                const meta = actionMeta(step.type);
                const StepIcon = meta.Icon;
                return <li key={`${step.order}:${index}`} className={`${index < litCount ? "on" : ""}${highlight === index ? " hl" : ""}`} onMouseEnter={() => setHighlight(index)} onMouseLeave={() => setHighlight(-1)}>
                  <span className="pn">{pad(index + 1)}</span>
                  <span className="ic galaxy-topology-node"><StepIcon size={16} /></span>
                  <span className="galaxy-topology-copy"><strong>{pad(index + 1)} · {meta.domain}</strong><small>{describeStep(step)}</small></span>
                </li>;
              })}
            </ol> : <p className="galaxy-topology-empty">Aucune action active dans cette chaîne.</p>}
          </div>
        </div>
      </div>}

      {children?.({ map: <ProfileMap entries={mapEntries} selectedKey={currentKey ?? undefined} activeKey={activeModeId} onSelect={setFocusedKey} /> })}
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

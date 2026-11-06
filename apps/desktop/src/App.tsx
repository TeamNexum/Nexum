import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { api, IS_DESKTOP, onEngineEvent } from "./api";
import { startRemoteControl, syncDirectModes } from "./remote";
import type { Mode } from "./types";
import Dashboard from "./components/Dashboard";
import LiveActions, { useActivity } from "./components/LiveActions";
import CommandPalette from "./components/CommandPalette";
import ModeEditor from "./components/ModeEditor";
import Automations from "./components/Automations";
import Marketplace from "./components/Marketplace";
import Settings from "./components/Settings";
import WindowBar from "./components/WindowBar";
import SkyBackground from "./components/SkyBackground";
import PixelGalaxy from "./components/PixelGalaxy";
import GalaxyFlight, { measureGalaxy, type Flight } from "./components/GalaxyFlight";
import VoiceOverlay from "./components/VoiceOverlay";
import FeedbackDialog from "./components/FeedbackDialog";
import { categoryMeta } from "./modeMeta";
import { tintOf, tintStyle } from "./galaxyTints";
import { useLibraryPreferences } from "./libraryPreferences";
import {
  IconLogo,
  IconDashboard,
  IconSliders,
  IconAutomations,
  IconMarketplace,
  IconSettings,
} from "./components/Icons";

type Tab = "dashboard" | "editor" | "automations" | "marketplace" | "settings";

const TABS: { id: Tab; label: string; Icon: React.ComponentType<{ size?: number }> }[] = [
  { id: "dashboard", label: "Accueil", Icon: IconDashboard },
  { id: "editor", label: "Studio", Icon: IconSliders },
  { id: "automations", label: "Règles", Icon: IconAutomations },
  { id: "marketplace", label: "Découvrir", Icon: IconMarketplace },
  { id: "settings", label: "Système", Icon: IconSettings },
];

/** Time the old page takes to fade out before the galaxy flies to its new place. */
const LEAVE_MS = 150;
type Motion = "smooth" | "instant";
const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function App() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [motion, setMotion] = useState<Motion>(() => {
    try { return localStorage.getItem("nexum.motion") === "instant" ? "instant" : "smooth"; } catch { return "smooth"; }
  });
  const [flight, setFlight] = useState<Flight | null>(null);
  const [leaving, setLeaving] = useState(false);
  const switching = useRef(0);
  const flightPending = useRef(false);
  const contentRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const activity = useActivity();
  const [searchOpen, setSearchOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [density, setDensity] = useState<"compact" | "comfort">(() => {
    try { return localStorage.getItem("nexum.density") === "compact" ? "compact" : "comfort"; } catch { return "comfort"; }
  });
  useEffect(() => {
    const shortcut = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (!document.querySelector("dialog[open]")) setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, []);
  function changeMotion(value: Motion) {
    setMotion(value);
    try { localStorage.setItem("nexum.motion", value); } catch { setError("Le réglage des animations n’a pas pu être enregistré pour le prochain lancement."); }
  }
  /** Page change: the page fades out, the galaxy travels to its new place, the new page fades in. */
  const goTo = useCallback((next: Tab) => {
    if (next === tab || switching.current) return;
    if (motion !== "smooth" || prefersReducedMotion()) { setTab(next); return; }
    const source = measureGalaxy();
    flightPending.current = !!source;
    setFlight(source ? { from: source.rect, fromTint: source.tint, to: null, toTint: null } : null);
    setLeaving(true);
    switching.current = window.setTimeout(() => { switching.current = 0; setTab(next); setLeaving(false); }, LEAVE_MS);
  }, [tab, motion]);
  useEffect(() => () => window.clearTimeout(switching.current), []);
  useLayoutEffect(() => {
    if (!flightPending.current) return;
    flightPending.current = false;
    contentRef.current?.scrollTo(0, 0);
    const target = measureGalaxy();
    setFlight(f => (f && target ? { ...f, to: target.rect, toTint: target.tint } : null));
  }, [tab]);
  // The tab underline glides from one tab to the next.
  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const place = () => {
      const active = nav.querySelector<HTMLElement>(".console-tab.active");
      if (!active) return;
      const style = getComputedStyle(active);
      const left = parseFloat(style.paddingLeft), right = parseFloat(style.paddingRight);
      nav.style.setProperty("--ind-x", `${active.offsetLeft + left}px`);
      nav.style.setProperty("--ind-w", `${Math.max(8, active.offsetWidth - left - right)}px`);
    };
    place();
    const settle = requestAnimationFrame(() => requestAnimationFrame(() => nav.setAttribute("data-placed", "")));
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(place);
    observer?.observe(nav);
    void document.fonts?.ready.then(place);
    return () => { observer?.disconnect(); cancelAnimationFrame(settle); };
  }, [tab]);
  function changeDensity(value: "compact" | "comfort") {
    setDensity(value);
    try { localStorage.setItem("nexum.density", value); } catch { setError("La densité n’a pas pu être enregistrée pour le prochain lancement."); }
  }
  const [modes, setModes] = useState<Mode[]>([]);
  const library = useLibraryPreferences(modes);
  const [editingModeId, setEditingModeId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeModeId, setActiveModeId] = useState<string | null>(
    () => localStorage.getItem("nexum.active"),
  );

  const reload = useCallback(() => {
    if (!IS_DESKTOP) return;
    api
      .getModes()
      .then((m) => {
        setModes(m);
        syncDirectModes(m);
      })
      .catch((e) => setError(String(e)));
  }, []);

  useEffect(() => reload(), [reload]);

  useEffect(() => {
    if (!IS_DESKTOP) return;
    let unlisten: (() => void) | undefined;
    onEngineEvent((e) => {
      if (e.kind === "mode_started") {
        setActiveModeId(e.mode_id);
        localStorage.setItem("nexum.active", e.mode_id);
      }
    }).then((fn) => (unlisten = fn));
    return () => unlisten?.();
  }, []);

  useEffect(() => {
    if (!IS_DESKTOP) return;
    return startRemoteControl((cmd) => {
      if (cmd.kind === "activate_mode") {
        api
          .activateMode(cmd.mode_id)
          .then(reload)
          .catch((e) => setError(String(e)));
      }
    });
  }, [reload]);

  const activeMode = modes.find(mode => mode.id === activeModeId);
  const activeTint = tintOf(activeMode?.category);
  const totalActions = modes.reduce((n, m) => n + m.steps.filter(s => s.enabled).length, 0);

  return (<>
    <SkyBackground />
    <div className="app" data-density={density} data-workspace={tab} data-motion={motion} data-flight={flight ? "true" : undefined} style={tintStyle(activeTint, activeTint)}>
      <WindowBar />
      {/* CONSOLE TOP NAVIGATION */}
      <header className="console-topbar">
        <div className="console-brand">
          <IconLogo size={22} className="brand-icon" aria-hidden="true" />
          <span className="brand-name">NEXUM</span>
        </div>

        <nav className="console-nav" aria-label="Navigation principale" ref={navRef}>
          {TABS.map((t, index) => {
            const Icon = t.Icon;
            return (
              <button
                key={t.id}
                className={`console-tab ${tab === t.id ? "active" : ""}`}
                aria-label={t.label}
                aria-current={tab === t.id ? "page" : undefined}
                onClick={() => goTo(t.id)}
              >
                <span className="console-tab-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <span className="console-tab-orbit" aria-hidden="true"><Icon size={16} /></span>
                <span className="console-tab-label">{t.label}</span>
              </button>
            );
          })}
          <span className="nav-indicator" aria-hidden="true" />
        </nav>

        <div className="console-status">
          <button className="search-trigger" aria-label="Recherche globale" onClick={() => setSearchOpen(true)}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="6" /><path d="M15 15l5 5" /></svg>
            <span>Rechercher un profil…</span><kbd>Ctrl K</kbd>
          </button>
          {activeMode && <span className="active-chip"><i aria-hidden="true" /><span>Actif · </span><b>{activeMode.name}</b></span>}
          <span className="status-text">{IS_DESKTOP ? "Connecté" : "Aperçu Web"}</span>
          <span className={`status-dot ${IS_DESKTOP ? "online" : ""}`} />
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="content" ref={contentRef} data-leaving={leaving ? "true" : undefined}>
        {error && <div role="alert" className="error">{error}</div>}
        {library.error && <div role="alert" className="error">{library.error}</div>}
        {tab !== "dashboard" && <header className="workspace-heading">
          <div className="workspace-nova" aria-hidden="true"><PixelGalaxy tint={activeTint} /></div>
          <div><span className="workspace-kicker lab">VOTRE ESPACE / {TABS.find(t => t.id === tab)?.label.toUpperCase()}</span>
            <h1>{({ editor: "Composez votre environnement", automations: "Au bon moment", marketplace: "À votre façon", settings: "Votre Nexum" } as Record<string, string>)[tab]}</h1>
          </div>
          <div className="workspace-signature"><span className="workspace-counter">{String(modes.length).padStart(2, "0")} profils · {String(modes.reduce((n, m) => n + m.steps.length, 0)).padStart(2, "0")} actions</span></div>
        </header>}
        {tab === "dashboard" && (
          <>
            <Dashboard
              modes={library.modes}
              favorites={library.favorites}
              onFavorite={library.toggleFavorite}
              onMove={library.move}
              onEdit={id => { setEditingModeId(id); goTo("editor"); }}
              activeModeId={activeModeId}
              reload={reload}
            >
            {({ map }) => <div className="home-workspace below">
              <LiveActions activity={activity} mode={modes.find(mode => mode.id === activeModeId)} />
              <aside className="context-panel panel pad lib">
                <div className="lab">Carte des profils</div>
                {map}
                <div className="leg"><span>Profil</span><span className="m">Modèle</span><span className="a">Actif</span></div>
                <div className="library-totals nums"><div><strong>{String(modes.length).padStart(2, "0")}</strong><span>profils</span></div><div><strong>{String(totalActions).padStart(2, "0")}</strong><span>actions actives</span></div></div>
                {activeMode && <p className="context-current last">Dernier profil lancé : <b>{activeMode.name}</b></p>}
                <div className="context-links">
                  <button onClick={() => goTo("editor")}><IconSliders size={18} /><span>Personnaliser mes profils<small>Actions, volume et environnement</small></span><span aria-hidden="true">↗</span></button>
                  <button onClick={() => goTo("automations")}><IconAutomations size={18} /><span>Consulter mes règles<small>Déclencheurs et horaires</small></span><span aria-hidden="true">↗</span></button>
                  <button onClick={() => goTo("marketplace")}><IconMarketplace size={18} /><span>Trouver un modèle<small>Un point de départ pour chaque usage</small></span><span aria-hidden="true">↗</span></button>
                </div>
                {modes.length > 0 && <div className="category-strip chips">{[...new Set(modes.map(m => m.category))].map(c => <span key={c}>{categoryMeta(c).label}</span>)}</div>}
              </aside>
            </div>}
            </Dashboard>
          </>
        )}
        {tab === "editor" && <ModeEditor key={editingModeId ?? "studio"} modes={library.modes} reload={reload} initialModeId={editingModeId} />}
        {tab === "automations" && <Automations modes={modes} />}
        {tab === "marketplace" && <Marketplace modes={modes} reload={reload} />}
        {tab === "settings" && <Settings modes={modes} reload={reload} density={density} onDensity={changeDensity} motion={motion} onMotion={changeMotion} onFeedback={() => setFeedbackOpen(true)} />}
      </main>
      <VoiceOverlay />
      {searchOpen && <CommandPalette modes={library.modes} pages={TABS} onClose={() => setSearchOpen(false)} onNavigate={id => goTo(id as Tab)} onEdit={id => { setEditingModeId(id); goTo("editor"); }} onDensity={() => changeDensity(density === "compact" ? "comfort" : "compact")} onFeedback={() => setFeedbackOpen(true)} />}
      {flight && <GalaxyFlight flight={flight} onDone={() => setFlight(null)} />}
      {feedbackOpen && <FeedbackDialog onClose={() => setFeedbackOpen(false)} />}
    </div>
  </>);
}

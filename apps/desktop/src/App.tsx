import { useCallback, useEffect, useState } from "react";
import { api, IS_DESKTOP, onEngineEvent } from "./api";
import { startRemoteControl } from "./remote";
import type { Mode } from "./types";
import Dashboard from "./components/Dashboard";
import LiveActions, { useActivity } from "./components/LiveActions";
import CommandPalette from "./components/CommandPalette";
import ModeEditor from "./components/ModeEditor";
import Automations from "./components/Automations";
import Marketplace from "./components/Marketplace";
import Settings from "./components/Settings";
import WindowBar from "./components/WindowBar";
import { categoryMeta } from "./modeMeta";
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

export default function App() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const activity = useActivity();
  const [searchOpen, setSearchOpen] = useState(false);
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
      .then(setModes)
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

  return (
    <div className="app" data-density={density}>
      <WindowBar />
      {/* CONSOLE TOP NAVIGATION */}
      <header className="console-topbar">
        <div className="console-brand">
          <IconLogo size={24} className="brand-icon" />
          <span className="brand-name">NEXUM</span>
        </div>

        <nav className="console-nav" aria-label="Navigation principale">
          {TABS.map((t) => {
            const Icon = t.Icon;
            return (
              <button
                key={t.id}
                className={`console-tab ${tab === t.id ? "active" : ""}`}
                aria-current={tab === t.id ? "page" : undefined}
                onClick={() => setTab(t.id)}
              >
                <Icon size={16} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="console-status">
          <button className="search-trigger" aria-label="Recherche globale" onClick={() => setSearchOpen(true)}>Rechercher <kbd>Ctrl K</kbd></button>
          <span className="status-text">{IS_DESKTOP ? "Connecté" : "Aperçu Web"}</span>
          <span className={`status-dot ${IS_DESKTOP ? "online" : ""}`} />
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="content">
        {error && <div role="alert" className="error">{error}</div>}
        {library.error && <div role="alert" className="error">{library.error}</div>}
        {tab !== "dashboard" && <header className="workspace-heading">
          <div><span className="workspace-kicker">VOTRE ESPACE / {TABS.find(t => t.id === tab)?.label.toUpperCase()}</span>
            <h1>{({ editor: "Composez votre environnement", automations: "Au bon moment", marketplace: "À votre façon", settings: "Votre Nexum" } as Record<string, string>)[tab]}</h1>
          </div>
          <div className="workspace-signature"><span className="workspace-counter">{modes.length} profils · {modes.reduce((n, m) => n + m.steps.length, 0)} actions</span></div>
        </header>}
        {tab === "dashboard" && (
          <>
            <Dashboard
              modes={library.modes}
              favorites={library.favorites}
              onFavorite={library.toggleFavorite}
              onMove={library.move}
              onEdit={id => { setEditingModeId(id); setTab("editor"); }}
              activeModeId={activeModeId}
              reload={reload}
            />
            <div className="home-workspace">
              <LiveActions activity={activity} />
              <aside className="context-panel">
                <span className="workspace-kicker">VOTRE BIBLIOTHÈQUE</span>
                <h2>Tout à portée de main</h2>
                <div className="library-totals"><div><strong>{modes.length}</strong><span>profils</span></div><div><strong>{modes.reduce((n, m) => n + m.steps.filter(s => s.enabled).length, 0)}</strong><span>actions actives</span></div></div>
                {modes.find(m => m.id === activeModeId) && <p className="context-current">Dernier profil lancé : <b>{modes.find(m => m.id === activeModeId)?.name}</b></p>}
                <div className="context-links">
                  <button onClick={() => setTab("editor")}><IconSliders size={18} /><span>Personnaliser mes profils<small>Actions, volume et environnement</small></span><span>↗</span></button>
                  <button onClick={() => setTab("automations")}><IconAutomations size={18} /><span>Consulter mes règles<small>Déclencheurs et horaires</small></span><span>↗</span></button>
                  <button onClick={() => setTab("marketplace")}><IconMarketplace size={18} /><span>Trouver un modèle<small>Un point de départ pour chaque usage</small></span><span>↗</span></button>
                </div>
                {modes.length > 0 && <div className="category-strip">{[...new Set(modes.map(m => m.category))].map(c => <span key={c}>{categoryMeta(c).label}</span>)}</div>}
              </aside>
            </div>
          </>
        )}
        {tab === "editor" && <ModeEditor key={editingModeId ?? "studio"} modes={library.modes} reload={reload} initialModeId={editingModeId} />}
        {tab === "automations" && <Automations modes={modes} />}
        {tab === "marketplace" && <Marketplace modes={modes} reload={reload} />}
        {tab === "settings" && <Settings modes={modes} reload={reload} density={density} onDensity={changeDensity} />}
      </main>
      {searchOpen && <CommandPalette modes={library.modes} pages={TABS} onClose={() => setSearchOpen(false)} onNavigate={id => setTab(id as Tab)} onEdit={id => { setEditingModeId(id); setTab("editor"); }} onDensity={() => changeDensity(density === "compact" ? "comfort" : "compact")} />}
    </div>
  );
}

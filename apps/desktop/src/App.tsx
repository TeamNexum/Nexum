import { useCallback, useEffect, useState } from "react";
import { api, IS_DESKTOP, onEngineEvent } from "./api";
import { startRemoteControl } from "./remote";
import type { Mode } from "./types";
import Dashboard from "./components/Dashboard";
import ModeEditor from "./components/ModeEditor";
import Automations from "./components/Automations";
import Marketplace from "./components/Marketplace";
import Settings from "./components/Settings";
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
  const [modes, setModes] = useState<Mode[]>([]);
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

  const resetActive = () => {
    setActiveModeId(null);
    localStorage.removeItem("nexum.active");
  };

  return (
    <div className="app">
      {/* CONSOLE TOP NAVIGATION */}
      <header className="console-topbar">
        <div className="console-brand">
          <IconLogo size={24} className="brand-icon" />
          <span className="brand-name">NEXUM</span>
        </div>

        <nav className="console-nav">
          {TABS.map((t) => {
            const Icon = t.Icon;
            return (
              <button
                key={t.id}
                className={`console-tab ${tab === t.id ? "active" : ""}`}
                onClick={() => setTab(t.id)}
              >
                <Icon size={16} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="console-status">
          <span className="status-text">{IS_DESKTOP ? "Connecté" : "Aperçu Web"}</span>
          <span className={`status-dot ${IS_DESKTOP ? "online" : ""}`} />
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="content">
        {tab === "dashboard" && (
          <Dashboard
            modes={modes}
            activeModeId={activeModeId}
            reload={reload}
            onResetActive={resetActive}
          />
        )}
        {tab === "editor" && <ModeEditor modes={modes} reload={reload} />}
        {tab === "automations" && <Automations modes={modes} />}
        {tab === "marketplace" && <Marketplace modes={modes} reload={reload} />}
        {tab === "settings" && <Settings modes={modes} reload={reload} />}
      </main>
    </div>
  );
}

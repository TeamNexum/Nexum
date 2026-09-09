import { useEffect, useRef, useState } from "react";
import { onEngineEvent } from "../api";
import type { EngineEvent } from "../types";
import { actionMeta } from "../modeMeta";
import { IconActivity, IconCheck, IconAlert } from "./Icons";

interface LogItem {
  id: number;
  time: string;
  kind: EngineEvent["kind"];
  title: string;
  detail?: string;
  domain?: string;
  status: "ok" | "fail" | "running" | "info";
}

function formatNow(): string {
  const d = new Date();
  return d.toTimeString().split(" ")[0];
}

function parseEvent(e: EngineEvent): Omit<LogItem, "id" | "time"> {
  switch (e.kind) {
    case "mode_started":
      return {
        kind: e.kind,
        title: `Profil « ${e.name} » démarré`,
        status: "running",
      };
    case "step_started": {
      const am = actionMeta(e.action_type);
      return {
        kind: e.kind,
        title: am.label,
        domain: am.domain,
        status: "running",
      };
    }
    case "step_finished": {
      const am = actionMeta(e.action_type);
      return {
        kind: e.kind,
        title: am.label,
        detail: e.message,
        domain: am.domain,
        status: e.success ? "ok" : "fail",
      };
    }
    case "mode_finished":
      return {
        kind: e.kind,
        title: e.success ? "Orchestration terminée" : "Orchestration avec erreurs",
        status: e.success ? "ok" : "fail",
      };
  }
}

export default function LiveActions() {
  const [items, setItems] = useState<LogItem[]>([]);
  const counter = useRef(0);

  useEffect(() => {
    let unlisten: (() => void) | undefined;
    onEngineEvent((e) => {
      const parsed = parseEvent(e);
      const item: LogItem = {
        id: counter.current++,
        time: formatNow(),
        ...parsed,
      };
      setItems((prev) => [item, ...prev].slice(0, 40));
    }).then((fn) => (unlisten = fn));
    return () => unlisten?.();
  }, []);

  return (
    <div className="activity-panel">
      <div className="activity-header">
        <div className="activity-title-wrap">
          <IconActivity size={16} className="activity-pulse-icon" />
          <span className="activity-title">Moniteur</span>
        </div>
        {items.length > 0 && (
          <button className="activity-clear-btn" onClick={() => setItems([])}>
            Effacer
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="activity-empty">
          <span className="empty-radar" />
          <p className="empty-title">En attente d'actions</p>
          <span className="empty-sub">
            Activez un profil pour observer les instructions envoyées à vos périphériques.
          </span>
        </div>
      ) : (
        <div className="activity-stream">
          {items.map((item) => (
            <div key={item.id} className={`activity-row ${item.status}`}>
              <div className="activity-status-col">
                <span className={`status-glyph ${item.status}`}>
                  {item.status === "ok" ? (
                    <IconCheck size={11} />
                  ) : item.status === "fail" ? (
                    <IconAlert size={11} />
                  ) : item.status === "running" ? (
                    <span className="running-dot" />
                  ) : (
                    <span className="info-dot" />
                  )}
                </span>
                <span className="activity-line" />
              </div>

              <div className="activity-body">
                <div className="activity-topline">
                  {item.domain && <span className="activity-domain">{item.domain}</span>}
                  <span className="activity-item-title">{item.title}</span>
                  <span className="activity-time">{item.time}</span>
                </div>
                {item.detail && <p className="activity-detail">{item.detail}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

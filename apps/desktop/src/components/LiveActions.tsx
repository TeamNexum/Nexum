import { useEffect, useRef, useState } from "react";
import { onEngineEvent } from "../api";
import type { EngineEvent } from "../types";
import { actionMeta } from "../modeMeta";
import { IconActivity, IconCheck, IconAlert } from "./Icons";

interface LogItem {
  id: number;
  run: number;
  actionType?: string;
  order?: number;
  modeId?: string;
  time: string;
  startedAt: number;
  finishedAt?: number;
  runName: string;
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

function parseEvent(e: EngineEvent): Omit<LogItem, "id" | "time" | "run" | "startedAt" | "runName"> {
  switch (e.kind) {
    case "mode_started":
      return {
        kind: e.kind,
        modeId: e.mode_id,
        title: `Profil « ${e.name} » démarré`,
        status: "running",
      };
    case "step_started": {
      const am = actionMeta(e.action_type);
      return {
        kind: e.kind,
        actionType: e.action_type,
        order: e.order,
        title: am.label,
        domain: am.domain,
        status: "running",
      };
    }
    case "step_finished": {
      const am = actionMeta(e.action_type);
      return {
        kind: e.kind,
        actionType: e.action_type,
        order: e.order,
        title: am.label,
        detail: e.message,
        domain: am.domain,
        status: e.success ? "ok" : "fail",
      };
    }
    case "mode_finished":
      return {
        kind: e.kind,
        modeId: e.mode_id,
        title: e.success ? "Profil appliqué" : "Certaines actions ont échoué",
        status: e.success ? "ok" : "fail",
      };
  }
}

export function useActivity() {
  const [items, setItems] = useState<LogItem[]>([]);
  const counter = useRef(0);
  const run = useRef(0);
  const runName = useRef("Exécution en cours");

  useEffect(() => {
    let disposed = false;
    let unlisten: (() => void) | undefined;
    onEngineEvent((e) => {
      if (disposed) return;
      if (e.kind === "mode_started") { run.current++; runName.current = e.name; }
      const parsed = parseEvent(e);
      const item: LogItem = {
        id: counter.current++,
        run: run.current,
        time: formatNow(),
        startedAt: Date.now(),
        finishedAt: e.kind.endsWith("finished") ? Date.now() : undefined,
        runName: runName.current,
        ...parsed,
      };
      setItems((prev) => {
        const index = prev.findIndex((entry) => entry.run === item.run && (
          (e.kind === "step_finished" && entry.kind === "step_started" &&
            entry.order === e.order && entry.actionType === e.action_type) ||
          (e.kind === "mode_finished" && entry.kind === "mode_started" && entry.modeId === e.mode_id)
        ));
        if (index < 0) return [item, ...prev].slice(0, 40);
        return prev.map((entry, i) => i === index ? { ...item, id: entry.id, startedAt: entry.startedAt } : entry);
      });
    }).then((fn) => {
      if (disposed) fn();
      else unlisten = fn;
    });
    return () => {
      disposed = true;
      unlisten?.();
    };
  }, []);

  return { items, clear: () => setItems([]) };
}

export default function LiveActions({ activity }: { activity: ReturnType<typeof useActivity> }) {
  const { items, clear } = activity;
  const runs = [...new Set(items.map(item => item.run))].sort((a, b) => b - a);
  return (
    <div className="activity-panel">
      <div className="activity-header">
        <div className="activity-title-wrap">
          <IconActivity size={16} className="activity-pulse-icon" />
          <span className="activity-title">Activité récente</span>
        </div>
        {items.length > 0 && (
          <button className="activity-clear-btn" onClick={clear}>
            Effacer
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="activity-empty">
          <p className="empty-title">Tout est calme pour le moment</p>
          <span className="empty-sub">
            Les actions de vos profils apparaîtront ici.
          </span>
        </div>
      ) : (
        <div className="activity-stream">{runs.map(run => {
          const entries = items.filter(item => item.run === run);
          const session = entries.find(item => item.kind.startsWith("mode_"));
          const duration = session?.finishedAt ? ((session.finishedAt - session.startedAt) / 1000).toFixed(1) : null;
          return <details className="activity-session" key={run} open><summary><div><strong>{session?.runName ?? entries[0].runName}</strong><span>{session?.status === "ok" ? "Profil appliqué" : session?.status === "fail" ? "Certaines actions ont échoué" : "En cours"}</span></div><small>{session?.time ?? entries[0].time}{duration !== null ? ' · ' + duration + ' s' : ''}</small></summary>
          <ul aria-label="Historique des actions">
          {entries.filter(item => !item.kind.startsWith("mode_")).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((item) => (
            <li key={item.id} className="activity-row" data-status={item.status}>
              <div className="activity-status-col">
                <span className="status-glyph" aria-label={{ ok: "Réussi", fail: "Échec", running: "En cours", info: "Information" }[item.status]}>
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
              </div>

              <div className="activity-body">
                <div className="activity-topline">
                  <span className="activity-item-title">{item.title}</span>
                  <time className="activity-time">{item.time}</time>
                </div>
                <div className="activity-meta">
                  {item.domain && <span className="activity-domain">{item.domain}</span>}
                  <span className="activity-outcome">{{ ok: "Terminé", fail: "Échec", running: "En cours", info: "Information" }[item.status]}</span>
                  {item.detail && <details className="activity-details"><summary>Détails</summary><p className="activity-detail">{item.detail}</p></details>}
                </div>
              </div>
            </li>
          ))}
        </ul></details>;
        })}</div>
      )}
    </div>
  );
}

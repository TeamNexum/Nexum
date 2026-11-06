import { useEffect, useRef, useState } from "react";
import { onEngineEvent } from "../api";
import type { EngineEvent, Mode } from "../types";
import { actionMeta, describeStep } from "../modeMeta";
import { friendlyReason, statusOf } from "../stepStatus";
import GalaxyNodeTrack from "./GalaxyNodeTrack";

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
  status: "ok" | "fail" | "skipped" | "running" | "info";
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
      const status = statusOf(e);
      return {
        kind: e.kind,
        actionType: e.action_type,
        order: e.order,
        title: am.label,
        detail: status === "ok" ? e.message : friendlyReason(e.message),
        domain: am.domain,
        status: status === "ok" ? "ok" : status === "failed" ? "fail" : "skipped",
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

const TAGS = { ok: "OK", fail: "ERR", skipped: "IND", running: "RUN", info: "SYS" } as const;
const STATUS_LABEL = { ok: "Réussi", fail: "Échec", skipped: "Indisponible", running: "En cours", info: "Information" } as const;

export default function LiveActions({ activity, mode }: { activity: ReturnType<typeof useActivity>; mode?: Mode | null }) {
  const { items, clear } = activity;
  const readySteps = mode?.steps.filter(step => step.enabled).sort((a, b) => a.order - b.order).slice(0, 4) ?? [];
  const runs = [...new Set(items.map(item => item.run))].sort((a, b) => b - a);
  const hoursWithRuns = new Set(items.filter(item => item.kind === "mode_started").map(item => new Date(item.startedAt).getHours()));
  const currentHour = new Date().getHours();
  return (
    <div className="activity-panel panel pad">
      <div className="activity-header">
        <div className="activity-title-wrap lab">
          <span className="activity-title">Journal de bord · 24 h</span>
        </div>
        {items.length > 0 && (
          <button className="activity-clear-btn" onClick={clear}>
            Effacer
          </button>
        )}
      </div>
      <div className="strip" aria-hidden="true">{Array.from({ length: 24 }, (_, hour) => <i key={hour} className={hoursWithRuns.has(hour) ? "ev" : hour === currentHour ? "now" : ""} />)}</div>
      <div className="ticks" aria-hidden="true"><span>00</span><span>06</span><span>12</span><span>18</span><span>24</span></div>

      {items.length === 0 ? (
        <div className="activity-empty term">
          <div className="ln"><time /><span className="tg">SYS</span><span className="tx"><span className="empty-title">Aucune activité récente</span> <span className="empty-sub">Activez un profil ci-dessus pour suivre ses actions ici.</span></span></div>
          {mode && readySteps.length > 0 && <div className="activity-ready">
            <span className="activity-ready-heading lab">Au prochain lancement / {mode.name}</span>
            <GalaxyNodeTrack label={`Actions du prochain lancement de ${mode.name}`} items={readySteps.map((step, index) => {
              const meta = actionMeta(step.type);
              return { key: `${step.order}:${index}`, label: meta.domain === "Autre" ? "Action personnalisée" : meta.label, detail: meta.domain === "Autre" ? "Voir le profil pour le détail" : describeStep(step), Icon: meta.Icon, tone: index === 0 ? "accent" as const : "muted" as const };
            })} />
          </div>}
        </div>
      ) : (
        <div className="activity-stream term" role="log" aria-live="off">{runs.map(run => {
          const entries = items.filter(item => item.run === run);
          const session = entries.find(item => item.kind.startsWith("mode_"));
          const duration = session?.finishedAt ? ((session.finishedAt - session.startedAt) / 1000).toFixed(1).replace(".", ",") : null;
          return <details className="activity-session" key={run} open><summary><span className="ln"><time>{session?.time ?? entries[0].time}</time><span className={`tg ${session?.status ?? "run"}`}>{TAGS[session?.status === "running" || !session ? "running" : session.status]}</span><span className="tx"><strong>{session?.runName ?? entries[0].runName}</strong> · {session?.status === "ok" ? "Profil appliqué" : session?.status === "fail" ? (entries.some(e => e.status === "skipped") && !entries.some(e => e.status === "fail") ? "Actions indisponibles sur cette machine" : "Certaines actions ont échoué") : "En cours"}{duration !== null ? ` · ${duration} s` : ""}</span></span></summary>
          <ul aria-label="Historique des actions">
          {entries.filter(item => !item.kind.startsWith("mode_")).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((item) => (
            <li key={item.id} className="activity-row ln" data-status={item.status}>
              <time className="activity-time">{item.time}</time>
              <span className={`tg status-glyph ${item.status}`} aria-label={STATUS_LABEL[item.status]}>{TAGS[item.status]}</span>
              <span className="tx activity-body">
                <span className="activity-item-title">{item.title}</span>
                <span className="activity-meta">
                  {item.domain && <span className="activity-domain">{item.domain}</span>}
                  <span className="activity-outcome">{{ ok: "Terminé", fail: "Échec", skipped: "Indisponible ici", running: "En cours", info: "Information" }[item.status]}</span>
                  {item.detail && <details className="activity-details"><summary>Détails</summary><p className="activity-detail">{item.detail}</p></details>}
                </span>
              </span>
            </li>
          ))}
        </ul></details>;
        })}</div>
      )}
    </div>
  );
}

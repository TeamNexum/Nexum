// How the UI reads step outcomes: "failed" (the action ran and went wrong)
// versus "unavailable" (it could not run on this machine), plus plain-French
// reasons for the engine's technical messages.

import { useEffect, useState } from "react";
import { api } from "./api";
import { actionMeta } from "./modeMeta";
import type { ExecutionReport, StepStatus } from "./types";

/** Older reports (and the browser preview) only carry `success`. */
export function statusOf(step: { success: boolean; status?: StepStatus }): StepStatus {
  return step.status ?? (step.success ? "ok" : "failed");
}

const REASONS: [RegExp, string][] = [
  [/disabled by the user/i, "désactivée dans les réglages"],
  [/not yet implemented on this OS|unsupported on this OS/i, "non prise en charge sur ce système"],
  [/no controllable displays/i, "aucun écran contrôlable"],
  [/not paired/i, "pont Hue non appairé"],
  [/no adapter registered/i, "aucune intégration ne gère cette action"],
];

/** Short, user-facing reason for a step message. */
export function friendlyReason(message: string): string {
  const known = REASONS.find(([pattern]) => pattern.test(message));
  if (known) return known[1];
  return message.replace(/^adapter unavailable:\s*/i, "").replace(/^[a-z ]+ failed:\s*/i, "");
}

export interface RunSummary {
  total: number;
  ok: number;
  failed: number;
  unavailable: number;
  /** The first problem, to show in the toast: "Volume : non prise en charge sur ce système". */
  firstProblem: string | null;
}

export function summarize(report: ExecutionReport): RunSummary {
  const summary: RunSummary = { total: report.steps.length, ok: 0, failed: 0, unavailable: 0, firstProblem: null };
  // Failures matter more than unavailable steps, so report them first.
  let firstUnavailable: string | null = null;
  for (const step of report.steps) {
    const status = statusOf(step);
    summary[status]++;
    if (status === "ok") continue;
    const line = `${actionMeta(step.action_type).label} : ${friendlyReason(step.message ?? "")}`;
    if (status === "failed" && !summary.firstProblem) summary.firstProblem = line;
    if (status === "unavailable" && !firstUnavailable) firstUnavailable = line;
  }
  summary.firstProblem ??= firstUnavailable;
  return summary;
}

/** Headline for a finished run. */
export function runHeadline(s: RunSummary): string {
  const actions = (n: number) => `${n} action${n > 1 ? "s" : ""}`;
  if (s.failed > 0) return `${actions(s.failed)} en échec`;
  if (s.unavailable > 0) {
    return `${actions(s.unavailable)} indisponible${s.unavailable > 1 ? "s" : ""} sur cette machine`;
  }
  return "Profil activé";
}

/**
 * Actions that cannot run on this machine, with the reason, keyed by
 * action_type. Empty while loading, in the browser preview, or on error.
 */
export function useUnavailableActions(): Record<string, string> {
  const [unavailable, setUnavailable] = useState<Record<string, string>>({});
  useEffect(() => {
    let alive = true;
    api.actionAvailability()
      .then(list => {
        if (!alive || !list) return;
        setUnavailable(Object.fromEntries(
          list.filter(a => !a.available).map(a => [a.action_type, friendlyReason(a.reason ?? "")]),
        ));
      })
      .catch(() => {});
    return () => { alive = false; };
  }, []);
  return unavailable;
}

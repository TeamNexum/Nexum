import { useEffect, useState } from "react";
import { api } from "../api";
import type { Mode, RiskReport } from "../types";
import {
  MARKETPLACE_CATALOG,
  categoryMeta,
  catStyle,
  describeStep,
  toMode,
  type CatalogMode,
} from "../modeMeta";

const LEVEL_LABEL: Record<string, string> = {
  low: "Risque faible — sûr à publier",
  medium: "Risque moyen — relecture conseillée",
  high: "Risque élevé — relecture manuelle requise",
  rejected: "Rejeté — contient une action hors liste blanche",
};

export default function Marketplace({ modes, reload }: { modes: Mode[]; reload: () => void }) {
  const [risks, setRisks] = useState<Record<string, RiskReport>>({});
  const [installing, setInstalling] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  // Score every catalog mode with the real static analyzer, so the risk badge
  // shown on each card is genuine (not decorative). No-op in browser preview.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const entries = await Promise.all(
        MARKETPLACE_CATALOG.map(async (c) => {
          try {
            return [c.name, await api.assessMode(toMode(c, "preview"))] as const;
          } catch {
            return null;
          }
        }),
      );
      if (!cancelled) {
        setRisks(Object.fromEntries(entries.filter(Boolean) as [string, RiskReport][]));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function install(c: CatalogMode) {
    setInstalling(c.name);
    setMsg(null);
    try {
      const id = await api.newId();
      await api.saveMode(toMode(c, id));
      reload();
      setMsg(`« ${c.name} » ajouté à votre bibliothèque.`);
    } catch (e) {
      setMsg(String(e instanceof Error ? e.message : e));
    } finally {
      setInstalling(null);
    }
  }

  return (
    <div className="standard-view market">
      <section className="block">
        <h2>Marketplace — modes de la communauté</h2>
        <p className="muted">
          Installez un mode en un clic. Chaque mode est une donnée déclarative validée par notre
          analyse de sécurité : le badge de risque ci-dessous est réel, aucun code n'est exécuté.
        </p>
        <div className="market-grid">
          {MARKETPLACE_CATALOG.map((c) => {
            const cm = categoryMeta(c.category);
            const Icon = cm.Icon;
            const risk = risks[c.name];
            const owned = modes.some((m) => m.name.toLowerCase() === c.name.toLowerCase());
            return (
              <article key={c.name} className="market-card" style={catStyle(cm.color)}>
                <header className="mc-head">
                  <span className="mc-icon-wrap">
                    <Icon size={18} />
                  </span>
                  <div>
                    <div className="mc-name">{c.name}</div>
                    <div className="mc-author">{c.author ?? "@communauté"}</div>
                  </div>
                  {risk && <span className={`risk-badge ${risk.level}`}>{risk.level}</span>}
                </header>
                <p className="mc-tagline">{c.tagline}</p>
                <ul className="mc-steps">
                  {c.steps.slice(0, 4).map((s, i) => (
                    <li key={i}>{describeStep(s)}</li>
                  ))}
                </ul>
                <button
                  className="primary"
                  disabled={owned || installing != null}
                  onClick={() => install(c)}
                >
                  {owned ? "✓ Installé" : installing === c.name ? "Installation…" : "+ Installer"}
                </button>
              </article>
            );
          })}
        </div>
        {msg && <div className="ok">{msg}</div>}
      </section>

      <SafetyCheck modes={modes} />
    </div>
  );
}

/** The original "assess one of my modes" tool, kept as a secondary utility. */
function SafetyCheck({ modes }: { modes: Mode[] }) {
  const [selected, setSelected] = useState<string>("");
  const [report, setReport] = useState<RiskReport | null>(null);

  async function assess() {
    const mode = modes.find((m) => m.id === selected);
    if (!mode) return;
    setReport(await api.assessMode(mode));
  }

  return (
    <section className="block">
      <h2>Vérifier un de mes modes</h2>
      <p className="muted">
        Avant de partager un mode, contrôlez son niveau de risque (mêmes règles que le badge des
        cartes ci-dessus).
      </p>
      <div className="sim-row">
        <label>
          Mode à évaluer
          <select value={selected} onChange={(e) => setSelected(e.target.value)}>
            <option value="">— choisir un mode —</option>
            {modes.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </label>
        <button className="primary" disabled={!selected} onClick={assess}>
          Évaluer le risque
        </button>
      </div>

      {report && (
        <div className="risk">
          <div className={`risk-badge ${report.level}`}>{report.level.toUpperCase()}</div>
          <p>{LEVEL_LABEL[report.level]}</p>
          <p>
            Score de risque : <b>{report.score}</b>
          </p>
          {report.unknown_actions.length > 0 && (
            <div className="fail">Actions inconnues : {report.unknown_actions.join(", ")}</div>
          )}
          {report.issues.length > 0 && (
            <ul>
              {report.issues.map((issue, i) => (
                <li key={i}>⚠ {issue}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}

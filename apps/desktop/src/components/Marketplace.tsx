import { useEffect, useState } from "react";
import { api } from "../api";
import type { Mode, RiskReport } from "../types";
import ProfileDetails from "./ProfileDetails";
import ImportMode from "./ImportMode";
import {
  MARKETPLACE_CATALOG,
  RISK_LEVEL_LABEL,
  categoryMeta,
  catStyle,
  describeStep,
  toMode,
  type CatalogMode,
} from "../modeMeta";

export default function Marketplace({ modes, reload }: { modes: Mode[]; reload: () => void }) {
  const [risks, setRisks] = useState<Record<string, RiskReport>>({});
  const [installing, setInstalling] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [preview, setPreview] = useState<CatalogMode | null>(null);
  const filtered = MARKETPLACE_CATALOG.filter(c => (category === "all" || c.category === category) && `${c.name} ${c.tagline}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()));

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
    setError(null);
    try {
      const id = await api.newId();
      await api.saveMode(toMode(c, id));
      reload();
      setMsg(`« ${c.name} » ajouté à votre bibliothèque.`);
      setPreview(null);
    } catch (e) {
      setError(String(e instanceof Error ? e.message : e));
    } finally {
      setInstalling(null);
    }
  }

  return (
    <div className="standard-view market">
      <section className="block">
        <h2>Bibliothèque de profils</h2>
        <p className="muted">
          Découvrez des modèles prêts à personnaliser. Leur niveau de risque est évalué
          avant installation ; les actions ne s’exécutent qu’à l’activation du profil.
        </p>
        <div className="catalog-toolbar">
          <input aria-label="Rechercher un modèle" placeholder="Rechercher un modèle…" value={query} onChange={e => setQuery(e.target.value)} />
          <select aria-label="Filtrer par catégorie" value={category} onChange={e => setCategory(e.target.value)}><option value="all">Toutes les catégories</option>{[...new Set(MARKETPLACE_CATALOG.map(c => c.category))].map(c => <option key={c} value={c}>{categoryMeta(c).label}</option>)}</select>
          <span>{filtered.length} modèles</span>
        </div>
        <div className="market-grid">
          {filtered.map((c) => {
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
                <button className="btn-secondary market-preview" onClick={() => { setError(null); setPreview(c); }}>Voir les {c.steps.length} actions</button>
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
        {filtered.length === 0 && <p className="muted">Aucun modèle ne correspond à cette recherche.</p>}
        {msg && <div className="ok">{msg}</div>}
        {error && <div className="error" role="alert">{error}</div>}
      </section>

      <aside className="market-aside"><ImportMode onImported={reload} /><SafetyCheck modes={modes} /><section className="context-panel"><span className="workspace-kicker">DE L’IDÉE AU PROFIL</span><h2>Installez. Ajustez. Activez.</h2><ol className="guide-steps"><li><strong>Choisissez un modèle</strong><span>Consultez les actions incluses avant de l’ajouter.</span></li><li><strong>Faites-le vôtre</strong><span>Retrouvez-le dans le Studio pour régler chaque action.</span></li><li><strong>Lancez-le à votre rythme</strong><span>L’installation seule ne déclenche aucune action.</span></li></ol></section></aside>
      {preview && <ProfileDetails mode={toMode(preview, "catalog-preview")} onClose={() => setPreview(null)} onAction={() => void install(preview)} busy={installing !== null} error={error} actionDisabled={modes.some(m => m.name.toLowerCase() === preview.name.toLowerCase())} actionLabel={modes.some(m => m.name.toLowerCase() === preview.name.toLowerCase()) ? "Déjà installé" : "Ajouter à ma bibliothèque"} />}
    </div>
  );
}

/** The original "assess one of my modes" tool, kept as a secondary utility. */
function SafetyCheck({ modes }: { modes: Mode[] }) {
  const [selected, setSelected] = useState<string>("");
  const [report, setReport] = useState<RiskReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function assess() {
    const mode = modes.find((m) => m.id === selected);
    if (!mode) return;
    setError(null);
    try {
      setReport(await api.assessMode(mode));
    } catch (e) {
      setReport(null);
      setError(String(e instanceof Error ? e.message : e));
    }
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
          <select value={selected} onChange={(e) => { setSelected(e.target.value); setReport(null); setError(null); }}>
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

      {error && <div className="error" role="alert">{error}</div>}

      {report && (
        <div className="risk">
          <div className={`risk-badge ${report.level}`}>{report.level.toUpperCase()}</div>
          <p>{RISK_LEVEL_LABEL[report.level]}</p>
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

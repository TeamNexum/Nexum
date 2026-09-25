import { useEffect, useState } from "react";
import { api } from "../api";
import type { AutomationRule, Mode, Trigger } from "../types";

function describeTrigger(t: Trigger): string {
  switch (t.kind) {
    case "time_of_day":
      return `À ${String(t.hour).padStart(2, "0")}:${String(t.minute).padStart(2, "0")}`;
    case "app_launched":
      return `Au lancement de « ${t.name} »`;
    case "battery_below":
      return `Quand la batterie passe sous ${t.percent} %`;
    case "location_entered":
      return `À l’arrivée à « ${t.place} »`;
  }
}

export default function Automations({ modes }: { modes: Mode[] }) {
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [hour, setHour] = useState(18);
  const [minute, setMinute] = useState(0);
  const [weekday, setWeekday] = useState(2);
  const [activated, setActivated] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getAutomations().then(setRules).catch((e) => setError(String(e instanceof Error ? e.message : e)));
  }, []);

  const modeName = (id: string) => modes.find((m) => m.id === id)?.name ?? id;

  async function simulate() {
    setError(null);
    try {
      setActivated(await api.simulateTime(hour, minute, weekday));
    } catch (e) {
      setError(String(e instanceof Error ? e.message : e));
    }
  }

  return (
    <div className="standard-view automations">
      <section>
        <h2>Règles d’automatisation</h2>
        <p className="muted">
          Retrouvez les déclencheurs de vos profils et vérifiez les règles configurées.
        </p>
        <div className="summary-strip"><div><strong>{rules.length}</strong><span>règles configurées</span></div><div><strong>{rules.filter(r => r.enabled).length}</strong><span>activées</span></div><div><strong>{new Set(rules.map(r => r.target_mode_id)).size}</strong><span>profils associés</span></div></div>
        <ul className="rules">
          {rules.map((r) => (
            <li key={r.id}>
              <span className={`dot ${r.enabled ? "on" : "off"}`} />
              <div>
                <strong>{r.name}</strong>
                <small>
                  {describeTrigger(r.trigger)} → activer <b>{modeName(r.target_mode_id)}</b>
                </small>
                <span className="rule-state">{r.enabled ? "Activée" : "Désactivée"} · {r.conditions.length} conditions</span>
              </div>
            </li>
          ))}
          {rules.length === 0 && <li className="rules-empty"><div><strong>{error ? "Règles indisponibles" : "Aucune règle configurée"}</strong><small>{error ? "Le moteur de l’application de bureau est nécessaire pour charger vos règles." : "Vos déclencheurs apparaîtront ici dès qu’une règle sera configurée."}</small></div></li>}
        </ul>
      </section>

      <aside className="panel">
        <h2>Tester un horaire</h2>
        <p className="muted">
          Déclenchez les règles horaires pour vérifier leur comportement sans attendre l’heure réelle.
        </p>
        <div className="sim-row">
          <label>
            Heure
            <input type="number" min={0} max={23} value={hour} onChange={(e) => setHour(Number(e.target.value))} />
          </label>
          <label>
            Minute
            <input type="number" min={0} max={59} value={minute} onChange={(e) => setMinute(Number(e.target.value))} />
          </label>
          <label>
            Jour
            <select value={weekday} onChange={(e) => setWeekday(Number(e.target.value))}>
              {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((d, i) => (
                <option key={d} value={i}>
                  {d}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button className="primary" onClick={simulate}>
          Tester l’horaire
        </button>
        {activated && (
          <p className={activated.length ? "ok" : "muted"}>
            {activated.length
              ? `Profils activés : ${activated.join(", ")}`
              : "Aucune règle ne correspond à cet horaire."}
          </p>
        )}
        {error && <p className="error" role="alert">{error}</p>}
        <div className="panel-note"><strong>Un test réel</strong><p>Les profils correspondant à l’horaire choisi seront exécutés. Vous retrouverez leurs actions dans l’activité de l’accueil.</p></div>
      </aside>
    </div>
  );
}

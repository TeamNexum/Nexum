import { useEffect, useState } from "react";
import { api } from "../api";
import type { AutomationRule, Mode, Trigger } from "../types";

function describeTrigger(t: Trigger): string {
  switch (t.kind) {
    case "time_of_day":
      return `At ${String(t.hour).padStart(2, "0")}:${String(t.minute).padStart(2, "0")}`;
    case "app_launched":
      return `When "${t.name}" launches`;
    case "battery_below":
      return `When battery < ${t.percent}%`;
    case "location_entered":
      return `When arriving at "${t.place}"`;
  }
}

export default function Automations({ modes }: { modes: Mode[] }) {
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [hour, setHour] = useState(18);
  const [minute, setMinute] = useState(0);
  const [weekday, setWeekday] = useState(2);
  const [activated, setActivated] = useState<string[] | null>(null);

  useEffect(() => {
    api.getAutomations().then(setRules).catch(console.error);
  }, []);

  const modeName = (id: string) => modes.find((m) => m.id === id)?.name ?? id;

  async function simulate() {
    setActivated(await api.simulateTime(hour, minute, weekday));
  }

  return (
    <div className="standard-view automations">
      <section>
        <h2>Automation rules</h2>
        <p className="muted">
          Rules are declarative: <em>WHEN a trigger fires, IF conditions hold, THEN activate a
          mode</em>. Evaluated by the engine — no scripting.
        </p>
        <ul className="rules">
          {rules.map((r) => (
            <li key={r.id}>
              <span className={`dot ${r.enabled ? "on" : "off"}`} />
              <div>
                <strong>{r.name}</strong>
                <small>
                  {describeTrigger(r.trigger)} → activate <b>{modeName(r.target_mode_id)}</b>
                </small>
              </div>
            </li>
          ))}
          {rules.length === 0 && <p className="muted">No automation rules.</p>}
        </ul>
      </section>

      <aside className="panel">
        <h2>Simulate a clock tick</h2>
        <p className="muted">
          Demonstrates Sarah's persona (auto "Chill" at 18:00) without waiting for the real clock.
        </p>
        <div className="sim-row">
          <label>
            Hour
            <input type="number" min={0} max={23} value={hour} onChange={(e) => setHour(Number(e.target.value))} />
          </label>
          <label>
            Min
            <input type="number" min={0} max={59} value={minute} onChange={(e) => setMinute(Number(e.target.value))} />
          </label>
          <label>
            Weekday
            <select value={weekday} onChange={(e) => setWeekday(Number(e.target.value))}>
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => (
                <option key={d} value={i}>
                  {d}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button className="primary" onClick={simulate}>
          Fire tick
        </button>
        {activated && (
          <p className={activated.length ? "ok" : "muted"}>
            {activated.length
              ? `Activated: ${activated.join(", ")}`
              : "No rule matched this time."}
          </p>
        )}
      </aside>
    </div>
  );
}

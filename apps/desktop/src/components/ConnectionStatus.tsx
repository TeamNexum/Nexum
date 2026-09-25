import { useState } from "react";
import { api, IS_DESKTOP } from "../api";
import { cloudUrl } from "../sync";

type Check = { id: string; available: boolean; detail: string };
const labels = [{ id: "audio", name: "Audio" }, { id: "display", name: "Écran" }, { id: "hue", name: "Philips Hue" }, { id: "cloud", name: "Cloud" }];
export default function ConnectionStatus() {
  const [checks, setChecks] = useState<Check[]>([]);
  const [busy, setBusy] = useState(false);
  const [checkedAt, setCheckedAt] = useState<string | null>(null);
  async function verify() {
    setBusy(true);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 6000);
    const cloudCheck = async (): Promise<Check> => {
      const url = cloudUrl();
      try {
        const response = await fetch(`${url}/health`, { signal: controller.signal });
        const data = await response.json();
        if (!response.ok || data.status !== "ok" || data.service !== "nexum-cloud") throw new Error();
        return { id: "cloud", available: true, detail: `Service Nexum joignable · ${url}` };
      } catch { return { id: "cloud", available: false, detail: `Connexion non confirmée · ${url}` }; }
    };
    try {
      const [native, cloud] = await Promise.all([
        IS_DESKTOP ? api.checkConnections().catch(() => labels.slice(0, 3).map(l => ({ id: l.id, available: false, detail: "Diagnostic indisponible. Relancez l’application mise à jour." }))) : Promise.resolve(labels.slice(0, 3).map(l => ({ id: l.id, available: false, detail: "À vérifier dans l’application de bureau" }))),
        cloudCheck(),
      ]);
      setChecks([...native, cloud]);
      setCheckedAt(new Date().toLocaleTimeString("fr-FR"));
    } finally { clearTimeout(timeout); setBusy(false); }
  }
  return <section className="context-panel connection-panel"><div className="connection-heading"><div><span className="workspace-kicker">DIAGNOSTIC EN LECTURE SEULE</span><h2>État des connexions</h2></div><button className="btn-secondary" disabled={busy} onClick={() => void verify()}>{busy ? "Vérification…" : "Vérifier"}</button></div>
    <ul className="connection-list">{labels.map(label => {
      const check = checks.find(c => c.id === label.id);
      return <li key={label.id}><div><strong>{label.name}</strong><p>{check?.detail ?? "Aucune vérification effectuée"}</p></div><span>{busy ? "En cours" : !check ? "Non vérifié" : check.available ? "Disponible" : "Non confirmé"}</span></li>;
    })}</ul><p className="connection-time" role="status">{checkedAt ? `Dernière vérification à ${checkedAt}` : "Le contrôle ne modifie ni le volume, ni la luminosité, ni les lumières."}</p>
  </section>;
}

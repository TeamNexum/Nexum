import { useEffect, useRef, useState } from "react";
import { api } from "../api";
import type { Mode } from "../types";

export default function CommandPalette({ modes, pages, onNavigate, onEdit, onClose, onDensity }: {
  modes: Mode[]; pages: { id: string; label: string }[]; onNavigate: (id: string) => void;
  onEdit: (id: string) => void; onClose: () => void; onDensity: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const dialog = ref.current!; dialog.showModal();
    return () => { dialog.close(); if (previous?.isConnected) previous.focus(); };
  }, []);
  async function activate(mode: Mode) {
    setBusy(true); setMessage("");
    try { const report = await api.activateMode(mode.id); setMessage(report.success ? `${mode.name} activé.` : `${mode.name} : certaines actions ont échoué.`); }
    catch (error) { setMessage(String(error instanceof Error ? error.message : error)); }
    finally { setBusy(false); }
  }
  const commands = [
    ...pages.map(p => ({ id: p.id, label: `Ouvrir ${p.label}`, group: "Navigation", run: () => { onClose(); onNavigate(p.id); } })),
    ...modes.flatMap(m => [
      { id: `edit-${m.id}`, label: `Modifier ${m.name}`, group: "Profil", run: () => { onClose(); onEdit(m.id); } },
      { id: `activate-${m.id}`, label: `Activer ${m.name}`, group: "Action immédiate", run: () => void activate(m) },
    ]),
    { id: "density", label: "Basculer la densité Compact / Confort", group: "Interface", run: onDensity },
  ].filter(c => c.label.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
  return <dialog ref={ref} className="command-palette" aria-label="Recherche globale" onCancel={e => { e.preventDefault(); onClose(); }} onKeyDown={e => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    const buttons = Array.from(ref.current!.querySelectorAll<HTMLButtonElement>("[data-command]:not(:disabled)"));
    if (!buttons.length) return;
    e.preventDefault(); const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
    buttons[(index + (e.key === "ArrowDown" ? 1 : -1) + buttons.length) % buttons.length].focus();
  }}>
    <div className="command-search"><input autoFocus aria-label="Rechercher une page ou un profil" placeholder="Une page, un profil, une commande…" value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !busy) commands[0]?.run(); }} /><button className="btn-secondary" onClick={onClose} aria-label="Fermer la recherche">Esc</button></div>
    <div className="command-results">{commands.map(c => <button data-command key={c.id} disabled={busy} onClick={c.run}><span>{c.label}</span><small>{c.group}</small></button>)}{!commands.length && <p className="muted">Aucun résultat.</p>}</div>
    <footer><span>↑ ↓ Naviguer · Entrée Choisir · Échap Fermer</span>{(busy || message) && <p role="status">{busy ? "Activation en cours…" : message}</p>}</footer>
  </dialog>;
}

import { useMemo, type CSSProperties } from "react";
import type { Tint } from "../galaxyTints";

export interface MapEntry { key: string; name: string; tint: Tint; template: boolean }

function hash(text: string) {
  let h = 2166136261;
  for (let q = 0; q < text.length; q++) { h ^= text.charCodeAt(q); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function seeded(a: number) {
  return () => {
    a = Math.imul(a ^ (a >>> 15), 1 | a);
    a ^= a + Math.imul(a ^ (a >>> 7), 61 | a);
    return ((a ^ (a >>> 14)) >>> 0) / 4294967296;
  };
}

/** The library as a small star chart: profiles are solid nodes, templates are hollow, the active one pulses. */
export default function ProfileMap({ entries, selectedKey, activeKey, onSelect }: {
  entries: MapEntry[]; selectedKey?: string; activeKey?: string | null; onSelect: (key: string) => void;
}) {
  const layout = useMemo(() => {
    const rows = Math.max(1, Math.ceil(entries.length / 5));
    const pts = entries.map((entry, i) => {
      const rand = seeded(hash(`m${entry.name}`));
      const col = i % 5, row = Math.floor(i / 5);
      return [Math.round(30 + col * 60 + (rand() - 0.5) * 24), Math.round(44 + row * 64 + (rand() - 0.5) * 20)] as const;
    });
    return { pts, height: 44 + (rows - 1) * 64 + 42 };
  }, [entries]);
  const { pts, height } = layout;
  const profileCount = entries.filter(e => !e.template).length;
  const selected = entries.findIndex(e => e.key === selectedKey);

  return (
    <div className="mapw">
      <svg className="mapv" viewBox={`0 0 300 ${height}`} role="group" aria-label="Carte des profils">
        {pts.slice(0, Math.max(0, profileCount - 1)).map((p, q) => <line key={q} className="ml" x1={p[0]} y1={p[1]} x2={pts[q + 1][0]} y2={pts[q + 1][1]} />)}
        {entries.map((entry, i) => {
          const [x, y] = pts[i];
          return (
            <g key={entry.key} className={`mn${entry.template ? " md" : ""}`} tabIndex={0} role="button" aria-label={entry.name} aria-pressed={entry.key === selectedKey}
              style={{ "--c": entry.tint.join(",") } as CSSProperties}
              onClick={() => onSelect(entry.key)}
              onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect(entry.key); } }}>
              <rect className="mh" x={x - 12} y={y - 12} width="24" height="24" />
              {entry.key === activeKey && <rect className="ma" x={x - 9} y={y - 9} width="18" height="18" />}
              {entry.key === selectedKey && <><rect className="ar" x={x - 1} y={y - 11} width="2" height="22" /><rect className="ar" x={x - 11} y={y - 1} width="22" height="2" /></>}
              <rect className="mp" x={x - 4} y={y - 4} width="8" height="8" />
              <title>{entry.name}</title>
            </g>
          );
        })}
        {selected >= 0 && <text x={pts[selected][0] > 190 ? pts[selected][0] + 6 : pts[selected][0] - 6} y={pts[selected][1] - 15} textAnchor={pts[selected][0] > 190 ? "end" : "start"}>{entries[selected].name}</text>}
      </svg>
    </div>
  );
}

import { useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";

export interface ConstellationItem { domain: string; text: string }

const pad = (n: number) => String(n).padStart(2, "0");

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

/** Value shown on a plate: the figure or the name that matters, never a sentence. */
export function shortValue(text: string) {
  let m = text.match(/(\d+\s?%)/);
  if (m) return m[1].replace(/\s/g, "");
  if ((m = text.match(/«\s*([^»]+?)\s*»/))) return m[1];
  if ((m = text.match(/^Lancer (\S+)/))) return m[1];
  if ((m = text.match(/^Ouvrir (\S+)/))) return m[1].replace(/^https?:\/\//, "");
  const tail = text.split(".").pop() ?? text;
  return tail.length > 15 ? `${tail.slice(0, 14)}…` : tail;
}

const PW = 172, PH = 46, MARGIN = 22;
type Plate = { x: number; y: number; side: "l" | "r" };

function layout(name: string, n: number, W: number, H: number) {
  const rand = seeded(hash(name));
  const small = W < 600;
  const RX = small ? Math.max(60, Math.min(W * 0.32, 130)) : Math.max(80, Math.min(150, (W - 2 * PW - 2 * MARGIN - 90) / 2));
  const RY = Math.max(70, Math.min(H * 0.29, 128));
  const pts: [number, number][] = [];
  const plates: (Plate | undefined)[] = [];
  for (let q = 0; q < n; q++) {
    const a = ((-90 + 360 * q / n) * Math.PI) / 180;
    pts.push([Math.round(Math.cos(a) * RX), Math.round(Math.sin(a) * RY)]);
  }
  if (!small) {
    const sides: Record<"l" | "r", number[]> = { r: [], l: [] };
    for (let q = 0; q < n; q++) {
      const x0 = pts[q][0];
      sides[x0 > 8 ? "r" : x0 < -8 ? "l" : sides.r.length <= sides.l.length ? "r" : "l"].push(q);
    }
    (["r", "l"] as const).forEach(side => {
      const ids = sides[side].slice().sort((a, b) => pts[a][1] - pts[b][1]);
      const gap = PH + 12, limit = H / 2 - 54 - PH / 2;
      let ys = ids.map(i => Math.max(-limit, Math.min(limit, pts[i][1])));
      for (let t = 1; t < ys.length; t++) ys[t] = Math.max(ys[t], ys[t - 1] + gap);
      const over = ys.length ? ys[ys.length - 1] - limit : 0;
      if (over > 0) ys = ys.map(y => y - over);
      ids.forEach((i, t) => { plates[i] = { x: Math.round(side === "r" ? W / 2 - MARGIN - PW : -W / 2 + MARGIN), y: Math.round(ys[t] - PH / 2), side }; });
    });
  }
  const ghosts: { x: number; y: number; s: number; d: string }[] = [];
  for (let k = 0; k < 60 && ghosts.length < 14; k++) {
    const gx = Math.round((rand() - 0.5) * (W - 30)), gy = Math.round((rand() - 0.5) * (H - 70));
    let ok = Math.hypot(gx, gy * 1.15) > 70;
    plates.forEach(o => { if (o && gx > o.x - 14 && gx < o.x + PW + 14 && gy > o.y - 14 && gy < o.y + PH + 14) ok = false; });
    pts.forEach(b => { if (Math.hypot(gx - b[0], gy - b[1]) < 26) ok = false; });
    if (ok) ghosts.push({ x: gx, y: gy, s: rand() < 0.3 ? 3 : 2, d: (rand() * 2.6).toFixed(1) });
  }
  return { RX, RY, pts, plates, ghosts };
}

/**
 * Anatomy of a constellation (guide §06): a four-branch core, a dotted orbit with graduations, square nodes,
 * links that join the steps in execution order, and plates (number, name, value) aligned in columns.
 */
export default function Constellation({ name, items, phase, highlight, onHighlight }: {
  name: string;
  items: ConstellationItem[];
  phase: "idle" | "run" | "lit";
  highlight: number;
  onHighlight: (index: number) => void;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState({ w: 800, h: 480 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth || 800, h = el.clientHeight || 480;
      setSize(prev => (prev.w === w && prev.h === h ? prev : { w, h }));
    };
    measure();
    if (typeof ResizeObserver === "undefined") { window.addEventListener("resize", measure); return () => window.removeEventListener("resize", measure); }
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { w: W, h: H } = size;
  const n = items.length;
  const { RX, RY, pts, plates, ghosts } = useMemo(() => layout(name, n, W, H), [name, n, W, H]);
  const lit = phase === "lit", run = phase === "run";

  const segments = pts.map((b, q) => {
    const from = q === 0 ? [0, 0] : pts[q - 1];
    return { x1: from[0], y1: from[1], x2: b[0], y2: b[1], len: Math.round(Math.hypot(b[0] - from[0], b[1] - from[1])), q };
  });
  const segStyle = (s: { len: number; q: number }) => ({ "--l": s.len, "--i": s.q }) as CSSProperties;

  return (
    <svg ref={ref} className="cst" viewBox={`${-Math.floor(W / 2)} ${-Math.floor(H / 2)} ${W} ${H}`} aria-hidden="true" onMouseLeave={() => onHighlight(-1)}>
      <g className="fade" key={`${name}:${n}:${W}:${H}`}>
        <line className="ax" x1={-W / 2} y1="0" x2={W / 2} y2="0" />
        <line className="ax" x1="0" y1={-H / 2} x2="0" y2={H / 2} />
        <ellipse className="rg o" cx="0" cy="0" rx={RX + 64} ry={RY + 54} />
        <ellipse className="rg" cx="0" cy="0" rx={RX} ry={RY} />
        {Array.from({ length: 24 }, (_, q) => {
          const a = q * Math.PI / 12, tx = Math.cos(a), ty = Math.sin(a), len = q % 6 === 0 ? 10 : 4;
          return <line key={q} className="tk" x1={(tx * RX).toFixed(1)} y1={(ty * RY).toFixed(1)} x2={(tx * (RX + len)).toFixed(1)} y2={(ty * (RY + len * 0.9)).toFixed(1)} />;
        })}
        {ghosts.slice(0, 5).map((g, i) => {
          const best = pts.reduce((acc, b) => (Math.hypot(g.x - b[0], g.y - b[1]) < Math.hypot(g.x - acc[0], g.y - acc[1]) ? b : acc), pts[0] ?? [0, 0]);
          return <line key={i} className="gl" x1={g.x} y1={g.y} x2={best[0]} y2={best[1]} />;
        })}
        {ghosts.map((g, i) => <rect key={i} className="gs" x={g.x} y={g.y} width={g.s} height={g.s} style={{ "--d": `${g.d}s` } as CSSProperties} />)}
        {segments.map(s => <line key={`u${s.q}`} className="cu" x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} />)}
        {segments.map(s => <line key={`c${s.q}`} className={`cl${lit ? " lit" : ""}${run ? " run" : ""}`} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} style={segStyle(s)} />)}
        {run && segments.map(s => <line key={`h${s.q}`} className="cl hd" x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} style={segStyle(s)} />)}
        <g className="core">
          <rect className="ho" x="-8" y="-8" width="16" height="16" /><rect className="ho b" x="-8" y="-8" width="16" height="16" />
          <rect x="-2" y="-18" width="4" height="36" /><rect x="-18" y="-2" width="36" height="4" />
          <rect className="dm" x="-11" y="-11" width="3" height="3" /><rect className="dm" x="8" y="-11" width="3" height="3" />
          <rect className="dm" x="-11" y="8" width="3" height="3" /><rect className="dm" x="8" y="8" width="3" height="3" />
          <rect className="cd2" x="-6" y="-6" width="12" height="12" /><rect className="ci" x="-2" y="-2" width="4" height="4" />
        </g>
        {pts.map(([x, y], q) => {
          const o = plates[q];
          const text = items[q];
          return (
            <g key={q} className={`ng${lit ? " lit" : ""}${run ? " run" : ""}${highlight === q ? " hl" : ""}`} style={{ "--i": q } as CSSProperties} onMouseEnter={() => onHighlight(q)}>
              {o && (() => {
                const my = o.y + PH / 2, ex = o.side === "r" ? o.x - 18 : o.x + PW + 18, ed = o.side === "r" ? o.x : o.x + PW;
                return <><polyline className="ld" points={`${x},${y} ${ex},${my} ${ed},${my}`} /><rect className="le" x={ed - 2} y={my - 2} width="4" height="4" /></>;
              })()}
              <rect className="hi" style={{ "--n": q } as CSSProperties} x={x - 8} y={y - 8} width="16" height="16" />
              <rect className="ho" x={x - 8} y={y - 8} width="16" height="16" />
              <rect className="ar" x={x - 1} y={y - 15} width="2" height="30" /><rect className="ar" x={x - 15} y={y - 1} width="30" height="2" />
              <rect className="nf" x={x - 8} y={y - 8} width="16" height="16" /><rect className="nd" x={x - 3} y={y - 3} width="6" height="6" />
              <rect x={x - 18} y={y - 18} width="36" height="36" fill="transparent" />
              {o ? (
                <g className="pl">
                  <rect className="pb" x={o.x} y={o.y} width={PW} height={PH} />
                  <rect className="pn" x={o.x + 3} y={o.y} width="29" height={PH} />
                  <rect className="pa" x={o.x} y={o.y} width="3" height={PH} />
                  <text className="pi" x={o.x + 17} y={o.y + PH / 2 + 4} textAnchor="middle">{pad(q + 1)}</text>
                  <text className="n" x={o.x + 42} y={o.y + 19}>{text.domain.toUpperCase()}</text>
                  <text className="v" x={o.x + 42} y={o.y + 37}>{shortValue(text.text)}</text>
                </g>
              ) : <text className="ni" x={x + 11} y={y - 10}>{pad(q + 1)}</text>}
            </g>
          );
        })}
      </g>
    </svg>
  );
}

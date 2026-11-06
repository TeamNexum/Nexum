import { useEffect, useRef } from "react";
import type { Tint } from "../galaxyTints";
import { isWindowActive } from "../windowActivity";

/**
 * The signature image: a pixel spiral galaxy (central bar, two open arms, dust lanes, bright clusters).
 * Its gradient runs from a warm core to the profile tint to a cold blue rim, quantised to five levels
 * with a 4x4 Bayer matrix, so the picture never contains a blur or a smooth gradient.
 */
const N = 160;
const C = 80;
const PHI = -0.45;
const TL = 0.62;
const COS = Math.cos(PHI);
const SIN = Math.sin(PHI);
const BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];
const LEVELS = [0, 60, 125, 190, 255];
const WARM = [255, 238, 212];
const COOL = [150, 190, 255];
const FRAME_MS = 66; // 15 images per second, like a sprite

type Model = { radius: Float32Array; angle: Float32Array; weight: Float32Array; base: Float32Array; ring: Uint8Array };
let model: Model | null = null;

function buildModel(): Model {
  const rnd = Math.random;
  const gz = () => rnd() + rnd() + rnd() - 1.5;
  const arm = (r: number, k: number) => 0.3 + 1.7 * Math.log(1 + r / 8) + (k % 2) * Math.PI;
  const pts: number[] = [];
  const add = (r: number, a: number, w: number) => { pts.push(r, a, w); };
  let r: number;
  for (let k = 0; k < 5200; k++) { r = 6 + Math.pow(rnd(), 0.8) * 70; add(r, arm(r, k) + gz() * (0.12 + r * 0.0045), 0.2 + rnd() * 0.4); }
  for (let k = 0; k < 900; k++) {
    const bt = (rnd() - 0.5) * 44, bj = gz() * 3.2;
    const bx = bt * Math.cos(0.3) - bj * Math.sin(0.3), by = bt * Math.sin(0.3) + bj * Math.cos(0.3);
    add(Math.hypot(bx, by), Math.atan2(by, bx), 0.55);
  }
  for (let k = 0; k < 900; k++) add(Math.pow(rnd(), 2.2) * 16, rnd() * 6.283, 0.5);
  for (let k = 0; k < 700; k++) add(rnd() * 78, rnd() * 6.283, 0.12);
  for (let k = 0; k < 1200; k++) { r = 10 + rnd() * 64; add(r, arm(r, k) + Math.PI / 2 + gz() * 0.5, 0.12); }
  for (let k = 0; k < 90; k++) { r = 14 + rnd() * 54; add(r, arm(r, k) + gz() * 0.07, 1.3); }
  for (let k = 0; k < 1400; k++) { r = 10 + rnd() * 50; add(r, arm(r, k) + 0.38 + gz() * 0.07, -0.3); }
  const count = pts.length / 3;
  const radius = new Float32Array(count), angle = new Float32Array(count), weight = new Float32Array(count);
  for (let i = 0; i < count; i++) { radius[i] = pts[i * 3]; angle[i] = pts[i * 3 + 1]; weight[i] = pts[i * 3 + 2]; }
  const base = new Float32Array(N * N), ring = new Uint8Array(N * N);
  for (let j = 0; j < N; j++) {
    for (let i = 0; i < N; i++) {
      const dx = i - C, dy = j - C, u = dx * COS + dy * SIN, v = (-dx * SIN + dy * COS) / TL, d = Math.hypot(u, v);
      base[j * N + i] = 0.8 * Math.exp(-Math.pow(d / 9, 2)) + 0.2 * Math.exp(-Math.pow(d / 34, 2));
      ring[j * N + i] = Math.min(7, (d / 10) | 0);
    }
  }
  return { radius, angle, weight, base, ring };
}

function paint(ctx: CanvasRenderingContext2D, img: ImageData, grid: Float32Array, tint: number[], t: number, spin: number, flash: number) {
  const m = model!;
  const rot = t * 0.14 + spin, gain = 1 + 1.1 * flash;
  grid.fill(0);
  for (let n = 0; n < m.radius.length; n++) {
    const a = m.angle[n] + rot, px = m.radius[n] * Math.cos(a), py = m.radius[n] * Math.sin(a) * TL;
    const X = (C + px * COS - py * SIN) | 0, Y = (C + px * SIN + py * COS) | 0;
    if (X >= 0 && X < N && Y >= 0 && Y < N) grid[Y * N + X] += m.weight[n];
  }
  const accent = tint.map(c => Math.min(255, c * 0.75 + 64));
  const cool = tint.map((c, z) => Math.round(c * 0.3 + COOL[z] * 0.7));
  const table: number[][][] = [];
  for (let q = 0; q < 5; q++) {
    table[q] = [];
    const level = LEVELS[q] / 255;
    for (let b = 0; b < 8; b++) {
      const tt = b / 7;
      table[q][b] = [0, 1, 2].map(z => {
        let c = tt < 0.5 ? WARM[z] + (accent[z] - WARM[z]) * (tt / 0.5) : accent[z] + (cool[z] - accent[z]) * ((tt - 0.5) / 0.5);
        if (q === 4) c = c * 0.75 + 255 * 0.25;
        return Math.round(c * level);
      });
    }
  }
  const d = img.data;
  for (let s = 0; s < N * N; s++) {
    const v = Math.max(0, Math.min(1, (m.base[s] + grid[s] * 0.85) * gain));
    const q = Math.max(0, Math.min(4, Math.floor(v * 4 + (BAYER[((s / N) | 0) % 4][(s % N) % 4] + 0.5) / 16)));
    const c = table[q][m.ring[s]];
    d[s * 4] = c[0]; d[s * 4 + 1] = c[1]; d[s * 4 + 2] = c[2]; d[s * 4 + 3] = q ? 255 : 0;
  }
  ctx.putImageData(img, 0, 0);
}

export default function PixelGalaxy({ tint, kick = 0, animate = true, className = "", faded = false }: {
  tint: Tint; kick?: number; animate?: boolean; className?: string; faded?: boolean;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const state = useRef({ tint: [...tint], target: tint, spin: 0, spinTarget: 0, flash: 0, kick, redraw: () => {} });

  useEffect(() => {
    const s = state.current;
    s.target = tint;
    if (!animate) { s.tint = [...tint]; s.redraw(); }
  }, [tint, animate]);

  useEffect(() => {
    const s = state.current;
    if (s.kick === kick) return;
    s.kick = kick;
    s.spinTarget += 1.5;
    s.flash = 1;
    if (!animate) s.redraw();
  }, [kick, animate]);

  useEffect(() => {
    const el = canvas.current;
    const ctx = el?.getContext("2d");
    if (!el || !ctx) return;
    model ??= buildModel();
    const s = state.current;
    const img = ctx.createImageData(N, N);
    const grid = new Float32Array(N * N);
    const start = performance.now();
    const still = !animate || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const draw = () => paint(ctx, img, grid, s.tint, still ? 0 : (performance.now() - start) / 1000, s.spin, s.flash);
    s.redraw = () => { s.tint = [...s.target]; draw(); };
    draw();
    if (still) return () => { s.redraw = () => {}; };
    let frame = 0, last = 0;
    const loop = (now: number) => {
      if (isWindowActive() && now - last > FRAME_MS) {
        last = now;
        s.spin += (s.spinTarget - s.spin) * 0.09;
        s.flash = Math.max(0, s.flash - 0.035);
        for (let z = 0; z < 3; z++) s.tint[z] += (s.target[z] - s.tint[z]) * 0.12;
        draw();
      }
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(frame); s.redraw = () => {}; };
  }, [animate]);

  return <canvas ref={canvas} width={N} height={N} className={`pixel-galaxy${faded ? " faded" : ""} ${className}`.trim()} aria-hidden="true" />;
}

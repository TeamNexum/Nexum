import { useEffect, useRef } from "react";
import { isWindowActive } from "../windowActivity";

/**
 * Deep-space backdrop: a pixel Milky Way (dense diagonal band, warm bulb, cold edges, dust lane), rare stars
 * and a few four-branch stars that twinkle in two steps. Dithered with the same Bayer matrix as the galaxy.
 */
const SCALE = 3;
const BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];
const STAR_COLORS = ["255,255,255", "255,226,190", "190,210,255"];

function noise(w: number, h: number, cell: number) {
  const gw = Math.ceil(w / cell) + 2, gh = Math.ceil(h / cell) + 2, grid: number[] = [];
  for (let q = 0; q < gw * gh; q++) grid.push(Math.random());
  return (px: number, py: number) => {
    const u = px / cell, v = py / cell, i0 = u | 0, j0 = v | 0;
    let fu = u - i0, fv = v - j0;
    const a = grid[j0 * gw + i0], b = grid[j0 * gw + i0 + 1], c = grid[(j0 + 1) * gw + i0], d = grid[(j0 + 1) * gw + i0 + 1];
    fu = fu * fu * (3 - 2 * fu); fv = fv * fv * (3 - 2 * fv);
    return (a + (b - a) * fu) * (1 - fv) + (c + (d - c) * fu) * fv;
  };
}

export default function SkyBackground() {
  const wrap = useRef<HTMLDivElement>(null);
  const sky = useRef<HTMLCanvasElement>(null);
  const twinkle = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const skyCanvas = sky.current, twCanvas = twinkle.current, box = wrap.current;
    const x = skyCanvas?.getContext("2d"), xt = twCanvas?.getContext("2d");
    if (!skyCanvas || !twCanvas || !box || !x || !xt) return;
    let stars: [number, number][] = [];

    const paintSky = () => {
      const w = (skyCanvas.width = twCanvas.width = Math.ceil((window.innerWidth + 60) / SCALE));
      const h = (skyCanvas.height = twCanvas.height = Math.ceil((window.innerHeight + 60) / SCALE));
      const r = Math.random, E = Math.exp, pw = Math.pow, n1 = noise(w, h, 18), n2 = noise(w, h, 7);
      const alpha = [0, 0.06, 0.12, 0.21], warm = [255, 226, 186], cool = [150, 175, 235];
      stars = [];
      x.clearRect(0, 0, w, h);
      const perp = (px: number, py: number) => (py - h * 0.55 + px * 0.45 * h / w * -1 + h * 0.1) / 1.15;
      for (let j = 0; j < h; j += 2) {
        for (let i = 0; i < w; i += 2) {
          const p = perp(i, j), t = i / w;
          const band = E(-pw(p / (h * 0.19), 2));
          const core = E(-pw((t - 0.68) / 0.16, 2)) * E(-pw(p / (h * 0.09), 2)) * 0.95;
          const lane = E(-pw((p - h * 0.012) / (h * 0.024), 2)) * (0.3 + 0.7 * n2(i, j));
          const v = (band * (0.45 + 1.0 * n1(i, j)) + core) * (1 - 0.88 * lane);
          const q = Math.min(3, Math.floor(v * 2.8 + (BAYER[(j / 2 % 4) | 0][(i / 2 % 4) | 0] + 0.5) / 16));
          if (q > 0) {
            const mm = Math.min(1, core * 1.6);
            x.fillStyle = `rgba(${(cool[0] + (warm[0] - cool[0]) * mm) | 0},${(cool[1] + (warm[1] - cool[1]) * mm) | 0},${(cool[2] + (warm[2] - cool[2]) * mm) | 0},${alpha[q]})`;
            x.fillRect(i, j, 2, 2);
          }
        }
      }
      for (let k = 0, n = w * h / 40; k < n; k++) {
        const px = r() * w, py = r() * h, pp = perp(px, py);
        if (r() < 0.05 + 0.95 * E(-pw(pp / (h * 0.23), 2))) {
          x.fillStyle = `rgba(${STAR_COLORS[(r() * 3) | 0]},${0.2 + r() * 0.7})`;
          x.fillRect(px | 0, py | 0, 1, 1);
          if (r() < 0.012 && stars.length < 40) stars.push([px | 0, py | 0]);
        }
      }
      for (let k = 0; k < 18; k++) {
        const sx = (r() * w) | 0, sy = (r() * h) | 0, color = STAR_COLORS[(r() * 3) | 0];
        x.fillStyle = `rgba(${color},.95)`; x.fillRect(sx, sy, 1, 1);
        x.fillStyle = `rgba(${color},.5)`;
        x.fillRect(sx - 1, sy, 1, 1); x.fillRect(sx + 1, sy, 1, 1); x.fillRect(sx, sy - 1, 1, 1); x.fillRect(sx, sy + 1, 1, 1);
        if (stars.length < 48) stars.push([sx, sy]);
      }
    };

    const tick = () => {
      xt.clearRect(0, 0, twCanvas.width, twCanvas.height);
      for (const [sx, sy] of stars) {
        if (Math.random() < 0.5) {
          xt.fillStyle = `rgba(255,255,255,${0.45 + Math.random() * 0.55})`;
          xt.fillRect(sx, sy, 1, 1);
          if (Math.random() < 0.25) { xt.fillRect(sx - 1, sy, 1, 1); xt.fillRect(sx + 1, sy, 1, 1); xt.fillRect(sx, sy - 1, 1, 1); xt.fillRect(sx, sy + 1, 1, 1); }
        }
      }
    };

    paintSky(); tick();
    let resizeTimer = 0;
    const onResize = () => { clearTimeout(resizeTimer); resizeTimer = window.setTimeout(() => { paintSky(); tick(); }, 150); };
    window.addEventListener("resize", onResize);

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let interval = 0;
    const onMove = (e: MouseEvent) => {
      box.style.transform = `translate(${(-(e.clientX / window.innerWidth - 0.5) * 20).toFixed(1)}px,${(-(e.clientY / window.innerHeight - 0.5) * 14).toFixed(1)}px)`;
    };
    if (!still) {
      interval = window.setInterval(() => { if (isWindowActive()) tick(); }, 420);
      window.addEventListener("mousemove", onMove);
    }
    return () => {
      clearTimeout(resizeTimer); clearInterval(interval);
      window.removeEventListener("resize", onResize); window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return <div ref={wrap} className="sky-bg" aria-hidden="true"><canvas ref={sky} /><canvas ref={twinkle} /></div>;
}

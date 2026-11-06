import { useLayoutEffect, useRef, useState } from "react";
import type { Tint } from "../galaxyTints";
import PixelGalaxy from "./PixelGalaxy";

export interface FlightRect { left: number; top: number; width: number; height: number }
export interface Flight { from: FlightRect; fromTint: Tint; to: FlightRect | null; toTint: Tint | null }

export const FLIGHT_MS = 760;

/** The galaxy that travels between pages: from the middle of Accueil to the corner of every other page, and back. */
export const GALAXY_SELECTOR = ".fx .pixel-galaxy, .workspace-nova .pixel-galaxy";

export function measureGalaxy(): { rect: FlightRect; tint: Tint } | null {
  const el = document.querySelector<HTMLElement>(GALAXY_SELECTOR);
  if (!el) return null;
  const box = el.getBoundingClientRect();
  if (box.width < 8 || box.bottom < 0 || box.top > window.innerHeight || box.right < 0 || box.left > window.innerWidth) return null;
  const tint = getComputedStyle(el).getPropertyValue("--tint").split(",").map(part => parseInt(part, 10));
  return { rect: { left: box.left, top: box.top, width: box.width, height: box.height }, tint: (tint.length === 3 && tint.every(Number.isFinite) ? tint : [150, 90, 255]) as Tint };
}

export default function GalaxyFlight({ flight, onDone }: { flight: Flight; onDone: () => void }) {
  const box = useRef<HTMLDivElement>(null);
  const [tint, setTint] = useState<Tint>(flight.fromTint);
  const { from, to, toTint } = flight;

  useLayoutEffect(() => {
    const el = box.current;
    if (!to || !el) return;
    if (toTint) setTint(toTint);
    const animation = el.animate([
      { transform: "none" },
      { transform: `translate(${to.left - from.left}px, ${to.top - from.top}px) scale(${to.width / from.width}, ${to.height / from.height})` },
    ], { duration: FLIGHT_MS, easing: "cubic-bezier(.65, 0, .25, 1)", fill: "forwards" });
    animation.onfinish = onDone;
    animation.oncancel = onDone;
    return () => { animation.onfinish = null; animation.oncancel = null; animation.cancel(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [to]);

  return <div ref={box} className="galaxy-flight" aria-hidden="true" style={{ left: from.left, top: from.top, width: from.width, height: from.height, "--tint": tint.join(",") } as React.CSSProperties}>
    <PixelGalaxy tint={tint} />
  </div>;
}

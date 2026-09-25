import type { PointerEvent } from "react";
import { categoryMeta } from "../modeMeta";

/** CSS relief stays inside the tile, so it cannot change the shelf's scroll bounds. */
export default function ProfileArtwork({ category }: { category: string }) {
  const { Icon, label } = categoryMeta(category);

  function move(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const element = event.currentTarget;
    const bounds = element.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
    const y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
    element.style.setProperty("--tilt-x", `${(0.5 - y) * 14}deg`);
    element.style.setProperty("--tilt-y", `${(x - 0.5) * 14}deg`);
    element.style.setProperty("--light-x", `${x * 100}%`);
    element.style.setProperty("--light-y", `${y * 100}%`);
  }

  function reset(event: PointerEvent<HTMLDivElement>) {
    for (const property of ["--tilt-x", "--tilt-y", "--light-x", "--light-y"]) {
      event.currentTarget.style.removeProperty(property);
    }
  }

  return (
    <div className="cine-icon-stage profile-art" data-category={category}
      onPointerMove={move} onPointerLeave={reset} onPointerCancel={reset} aria-hidden="true">
      <span className="art-category">{label}</span>
      <div className="art-object">
        <span className="art-layer art-layer-back" />
        <span className="art-layer art-layer-middle" />
        <span className="art-layer art-layer-front"><Icon size={52} className="cine-icon" /></span>
      </div>
      <span className="art-caption">N / {label === "Personnalisé" ? "Custom" : label}</span>
    </div>
  );
}

import type { CSSProperties } from "react";

/** Profile tints from the Galaxy brand guide (§03). One tint per profile, never two on the same visual. */
export type Tint = [number, number, number];

const CATEGORY_TINT: Record<string, Tint> = {
  gaming: [150, 90, 255],
  work: [255, 235, 200],
  chill: [255, 150, 90],
  streaming: [255, 100, 200],
  night: [110, 150, 255],
  custom: [110, 255, 220],
};

export const DEFAULT_TINT: Tint = CATEGORY_TINT.gaming;

export function tintOf(category?: string | null): Tint {
  if (!category) return DEFAULT_TINT;
  return CATEGORY_TINT[category] ?? CATEGORY_TINT.custom;
}

/** Sets --tint (the profile in focus) and optionally --atint (the active profile). */
export function tintStyle(tint: Tint, activeTint?: Tint): CSSProperties {
  const style: Record<string, string> = { "--tint": tint.join(",") };
  if (activeTint) style["--atint"] = activeTint.join(",");
  return style as CSSProperties;
}

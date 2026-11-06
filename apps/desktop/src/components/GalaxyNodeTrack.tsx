import type { ComponentType } from "react";

export type GalaxyNodeItem = {
  key: string;
  label: string;
  detail?: string;
  Icon?: ComponentType<{ size?: number; className?: string }>;
  tone?: "accent" | "available" | "muted" | "warning";
};

export default function GalaxyNodeTrack({
  items,
  label,
  variant = "flow",
  className = "",
}: {
  items: GalaxyNodeItem[];
  label: string;
  variant?: "flow" | "compact" | "system" | "rule";
  className?: string;
}) {
  return <ol className={`galaxy-node-track ${variant} ${className}`.trim()} aria-label={label}>
    {items.map((item, index) => {
      const Icon = item.Icon;
      return <li key={item.key} data-tone={item.tone ?? (index === 0 ? "accent" : "muted")} title={item.detail}>
        <span className="galaxy-node-symbol">{Icon ? <Icon size={variant === "compact" ? 12 : 14} /> : <i />}</span>
        <span className="galaxy-node-copy"><strong>{item.label}</strong>{item.detail && <small>{item.detail}</small>}</span>
      </li>;
    })}
  </ol>;
}

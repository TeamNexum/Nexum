# Nexum — Palette & design tokens

Source of truth for colors. The desktop app (`apps/desktop/src/styles.css`) and
any brand asset must use these exact values. Inspired by the logo swirl and the
neon-setup identity: **cyan → purple → magenta on deep space**.

## Core palette (dark theme — primary)

| Token | Hex | Usage |
|---|---|---|
| `--nx-bg` | `#0B0E14` | App background (deep space) |
| `--nx-surface` | `#151A22` | Cards, panels |
| `--nx-surface-2` | `#1E2530` | Nested surfaces, inputs |
| `--nx-border` | `#2A323F` | Borders, dividers |
| `--nx-text` | `#E7EAF0` | Primary text |
| `--nx-muted` | `#8A93A3` | Secondary text |
| **`--nx-cyan`** | `#22D3EE` | **Primary** — actions, active, "ON" |
| **`--nx-purple`** | `#7C5CFF` | **Secondary** — badges, accents |
| **`--nx-magenta`** | `#F038A0` | Tertiary — highlights, streaming |
| `--nx-green` | `#22C55E` | Success |
| `--nx-amber` | `#F5B84B` | Warning |
| `--nx-red` | `#F0436E` | Error / danger |

## Signature gradient

```
linear-gradient(135deg, #22D3EE 0%, #7C5CFF 50%, #F038A0 100%)
```
Use for the logo lockup, hero elements, and the "activate" glow. Never for body text.

## Light theme (secondary — for docs/marketing)

| Token | Hex |
|---|---|
| bg | `#F7F8FB` |
| surface | `#FFFFFF` |
| border | `#E3E7EE` |
| text | `#0B0E14` |
| muted | `#5A6472` |
| cyan (on light) | `#0EA5C4` |
| purple (on light) | `#6D4AFF` |
| magenta (on light) | `#D81B84` |

## Typography

- **UI & headings:** Inter (system-ui fallback). Weights 400/600/800.
- **Code / DSL / logs:** ui-monospace, "JetBrains Mono", monospace.
- Scale: 12 / 13 / 14 (base) / 18 / 24 / 32 px. Letter-spacing +1px on uppercase labels.

## Accessibility

- Body text on `--nx-bg`/`--nx-surface` meets WCAG AA (≥ 4.5:1).
- Cyan/purple/magenta are used as accents on dark surfaces; when placing text on
  a cyan fill, use `#04211A`-dark text, not white.
- Never encode meaning by color alone — pair with icon/label (✓/✗, "Active").

## CSS token block (copy into `:root`)

```css
:root {
  --nx-bg:#0B0E14; --nx-surface:#151A22; --nx-surface-2:#1E2530; --nx-border:#2A323F;
  --nx-text:#E7EAF0; --nx-muted:#8A93A3;
  --nx-cyan:#22D3EE; --nx-purple:#7C5CFF; --nx-magenta:#F038A0;
  --nx-green:#22C55E; --nx-amber:#F5B84B; --nx-red:#F0436E;
  --nx-gradient:linear-gradient(135deg,#22D3EE 0%,#7C5CFF 50%,#F038A0 100%);
}
```

# Nexum — Palette & design tokens

Source of truth for colors. Nexum's identity is **strictly monochrome** (black, greys,
white), matching the halftone "N" logo and the desktop app (`apps/desktop/src/styles.css`
and `materials.css`). Colour never carries meaning: state is shown with labels and icons.

## Dark theme (primary)

| Token | Value | Usage |
|---|---|---|
| `--nx-app-bg` | `#080808` (`#090909` in `materials.css`) | App and visual background |
| topbar | `#0B0B0B` | Title bar, headers |
| `--panel-primary` | `#131313` | Cards, main panels |
| `--panel-secondary` | `#101010` | Nested panels |
| `--nx-text` | `#F2F2F2` | Primary text, logo |
| `--nx-text-muted` | `#ACACAC` | Secondary text |
| `--nx-text-dim` | `#8C8C8C` | Metadata (never critical info) |
| `--nx-border` | `#FFFFFF0C` (white 5 %) | Dividers |
| `--nx-border-strong` | `#FFFFFF23` (white 14 %) | Focus, active elements |

## Light theme (documents, print)

| Role | Hex |
|---|---|
| bg | `#FFFFFF` |
| surface | `#F4F4F4` |
| border | `#E2E2E2` |
| text | `#0A0A0A` |
| muted | `#5C5C5C` |

## Typography

- **Wordmark:** Inter 500, uppercase, letter-spacing +0.24em.
- **Headings:** Inter 300–400, letter-spacing −0.035em.
- **UI & body:** Inter 400/500 (system-ui fallback), 14 px minimum.
- **Code / modes / logs:** JetBrains Mono 400/500.
- Scale: 12 / 13 / 14 (base) / 18 / 24 / 32 / 48 px.

## Accessibility

- `#F2F2F2` on `#080808` ≈ 18:1, `#ACACAC` ≈ 8.8:1, `#8C8C8C` ≈ 6:1 (all ≥ WCAG AA).
- Never encode meaning by colour — pair with an icon or label (✓/✗, "Active").

## Legacy

The previous neon identity (cyan `#22D3EE` → purple `#7C5CFF` → magenta `#F038A0`, ring
logo in `logo-mark.svg` / `logo-wordmark.svg`) is retired. Do not use it in new material.

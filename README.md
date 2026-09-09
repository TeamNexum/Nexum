# Nexum — official monorepo

Universal, no-code, brand-agnostic control center for your digital setup.
One click activates a **Mode** that orchestrates system actions, apps,
peripherals and IoT.

> This is the **official rebuild** scaffold. The earlier proof-of-concept lives
> in `../G-EIP-.../Nexum_app` and is kept only for reference.

## Features in this scaffold

- **Declarative Mode/Action DSL** shared across the whole app (`nexum-schema`).
- **Orchestration engine** with adapter registry, event bus, per-step `on_error`, real-time events (`nexum-core`).
- **Automation engine** — declarative WHEN/IF/THEN rules, evaluated in pure Rust (tested).
- **Marketplace safety** — static analysis + risk scoring of shared modes against an allowlist (tested).
- **AI "Mode-as-Code"** — natural language → validated Mode DSL (`nexum-core::ai`, tested; heuristic today, swaps to a Claude API call in production). Exposed in the cloud API and the editor's ✨ button.
- **Adapters** — System / Gaming (real, cross-platform), Audio (Linux), real **Philips Hue** (behind the `hue` feature), Display/RGB (mock/TODO).
- **Persistence** — `ModeStore` trait, in-memory always, **SQLite** behind the `sqlite` feature.
- **Cloud** — axum API skeleton.
- **Desktop app** — Tauri 2 + React with 4 tabs: **Dashboard** (activate modes, live event feed),
  **no-code Mode Editor** (add/reorder steps, per-action param forms), **Automations** (rules + clock
  simulation for the "Chill at 18:00" demo), **Marketplace** (risk assessment).
- **CI** — GitHub Actions: fmt + clippy + tests (core) and typecheck/build (frontend).
- **EIP documents** — full jury document set in [`docs/eip/`](docs/eip/README.md).

## Core idea

Everything is a typed **Action**, executed by a platform **Adapter**,
orchestrated by an event-driven **Engine**, from a declarative **Mode/Action
JSON DSL** that is shared by every component. A mode is *data, never code* — which
is what makes no-code editing, a safe Marketplace, and AI "Mode-as-Code" possible.

See the full design in **`../NEXUM_PLAN_TECHNIQUE_ET_ROADMAP.md`**.

## Layout

```
nexum/
├── crates/
│   ├── nexum-schema     # The Mode/Action DSL — single source of truth
│   ├── nexum-core       # Engine, Registry, Adapter trait, Event Bus (OS-agnostic, tested)
│   ├── nexum-adapters   # System / Audio / Gaming / Display integrations (+ Mock)
│   └── nexum-store      # Persistence trait + in-memory impl (SQLite to follow)
├── services/
│   └── nexum-cloud      # axum API skeleton (sync, marketplace, AI later)
├── apps/
│   ├── desktop          # Tauri 2 + React (its OWN cargo workspace)
│   └── mobile           # placeholder (Phase 2)
├── packages/
│   └── schema-ts        # TypeScript mirror of the DSL
└── docs/
```

The root `Cargo.toml` is a workspace over `crates/*` + `services/*`.
`apps/desktop/src-tauri` is intentionally a **separate** workspace so Tauri's
build machinery never affects the core build/CI.

## Documentation

- **[docs/GETTING_STARTED.md](docs/GETTING_STARTED.md)** — install everything & launch the project.
- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** — diagrams & rationale · **[docs/adr/](docs/adr/)** — decision records.
- **[docs/README.md](docs/README.md)** — full documentation index (technical · RNCP · EIP · brand).
- **[CONTRIBUTING.md](CONTRIBUTING.md)** · **[docs/GITHUB_SETUP.md](docs/GITHUB_SETUP.md)**.

## Prerequisites

- **Rust** (stable) — https://rustup.rs   (⚠️ not currently installed on this machine)
- **Node.js + npm** (for the desktop frontend / Tauri CLI)
- Tauri OS deps: see https://tauri.app/start/prerequisites/
  (Linux also needs `libdbus`/`pactl` for the audio adapter).

## Build & test the core (no Node needed)

```bash
cd nexum
cargo build            # builds all crates + the cloud service
cargo test             # runs the engine + schema + store unit tests
cargo clippy           # lint
```

Run the cloud API skeleton:

```bash
cargo run -p nexum-cloud     # serves http://127.0.0.1:8787/health
```

## Run the desktop app

```bash
cd nexum/apps/desktop
npm install
npm run tauri dev
```

You should see three demo modes. Activating one runs the **real** engine:
`system.open_url` / `gaming.launch_steam` actually fire; `audio.set_volume`
works on Linux; brightness/Hue/RGB are handled by a mock for now (each step
reports its real success/failure in the "Live actions" panel).

## Status of adapters (V1)

| Action                          | Status                                        |
|---------------------------------|-----------------------------------------------|
| `system.launch_app / close_app / open_url` | ✅ cross-platform                   |
| `gaming.launch_steam`           | ✅ via `steam://` (official, anti-cheat-safe) |
| `audio.set_volume`              | ✅ Linux · ⛔ Windows Core Audio **TODO**     |
| `display.set_brightness`        | ⛔ TODO (validates only)                       |
| `iot.hue.activate_scene`        | 🔸 mocked — real Hue integration Phase 1      |
| `peripheral.apply_rgb_profile`  | 🔸 mocked — Phase 1                            |

## Immediate Phase-0 TODOs

1. Fix **Windows volume** via the `windows` crate (Core Audio). Windows is the priority OS.
2. Wire **ts-rs** into `nexum-schema` to auto-generate `packages/schema-ts` (kill hand-mirroring).
3. Real **SQLite** `ModeStore` (offline-first) behind the existing trait.
4. First real **Philips Hue** adapter (best live-demo payoff).
5. **no-code mode editor** UI.

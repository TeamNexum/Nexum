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
- **Adapters** — real System / Gaming, Windows and Linux Audio, Windows and Linux Display, and Philips Hue (behind the `hue` feature). RGB remains unimplemented.
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
│   ├── nexum-adapters   # System / Audio / Gaming / Display / Hue integrations
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

- **Rust** (stable) — https://rustup.rs
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
works on Windows and Linux. Brightness controls supported displays, and Hue
uses a configured bridge. RGB is not offered in the action catalog; older saved
modes with an RGB action report that no adapter is registered. The live action
monitor shows each step's result.

## Status of adapters (V1)

| Action                          | Status                                        |
|---------------------------------|-----------------------------------------------|
| `system.launch_app / close_app / open_url` | ✅ cross-platform                   |
| `gaming.launch_steam`           | ✅ via `steam://` (official, anti-cheat-safe) |
| `audio.set_volume`              | ✅ Windows Core Audio and Linux                |
| `display.set_brightness`        | ✅ Windows/Linux where hardware supports it   |
| `iot.hue.activate_scene`        | ✅ with a configured Hue bridge and scene name|
| `peripheral.apply_rgb_profile`  | ⛔ no adapter yet                              |

The Windows volume adapter, generated TypeScript bindings, SQLite desktop
store, Hue scene lookup, and no-code editor are implemented. Hardware
integrations still need live device testing.

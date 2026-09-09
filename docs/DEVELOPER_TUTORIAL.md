# Nexum — Developer Tutorial (launch the project from zero)

A complete, copy-paste walkthrough: install the tools, get the code building, run
every part (core, cloud API, desktop app), and build release installers. Written
for someone who has never touched the project.

> Reading order: this tutorial is the hands-on version of
> [`GETTING_STARTED.md`](GETTING_STARTED.md). Architecture is in
> [`ARCHITECTURE.md`](ARCHITECTURE.md); contribution rules in
> [`../CONTRIBUTING.md`](../CONTRIBUTING.md).

---

## 0. What you'll be able to run at the end

| Part | Command | Result |
|---|---|---|
| Rust core + tests | `cargo test` | Engine, DSL, adapters, automation, marketplace unit tests pass |
| Cloud API | `cargo run -p nexum-cloud` | REST API on `http://127.0.0.1:8787` |
| Desktop app | `npm run tauri dev` | The Nexum window (Dashboard, Editor, Automations, Marketplace) |
| Release build | `npm run tauri build` | Installers under `src-tauri/target/release/bundle/` |

The repository root is the **`nexum/`** folder. All commands below assume you are
inside it unless stated otherwise.

---

## 1. Prerequisites — what to download

| Tool | Version | Why | Get it |
|---|---|---|---|
| **Rust** | stable (via rustup) | Core, adapters, cloud, Tauri backend | https://rustup.rs |
| **Node.js** | 20 LTS or newer | Desktop frontend + Tauri CLI | https://nodejs.org |
| **Git** | any recent | Clone / version control | https://git-scm.com |
| **C toolchain** | — | Needed by the `sqlite` feature and Tauri | see per-OS below |
| **Tauri OS deps** | — | Build the desktop app | https://tauri.app/start/prerequisites/ |

### 1.1 Windows (primary target)

1. Install **Visual Studio Build Tools** → check **"Desktop development with C++"**
   (gives MSVC + Windows SDK). https://visualstudio.microsoft.com/downloads/
2. Install **Rust**: download & run `rustup-init.exe` from https://rustup.rs (pick the MSVC toolchain).
3. Install **Node.js 20 LTS** from https://nodejs.org.
4. **WebView2 runtime** — already on Windows 10/11; if missing, install "Evergreen" from Microsoft.
5. Reopen your terminal (PowerShell) so `PATH` updates.

### 1.2 Linux (Debian / Ubuntu)

```bash
sudo apt update
sudo apt install -y curl wget file git build-essential pkg-config \
  libwebkit2gtk-4.1-dev libxdo-dev libssl-dev librsvg2-dev \
  libayatana-appindicator3-dev
# Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
# Node 20 (nvm recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
nvm install 20
```
The audio adapter uses `pactl` (PipeWire/PulseAudio), normally already installed.

### 1.2b Fedora / RHEL (`dnf`)

`apt` is **not** Fedora's package manager — use **`dnf`**, with different package names.
Fedora 38+ ships webkit2gtk 4.1, so Tauri v2 builds fine.

```bash
# Tauri v2 system deps
sudo dnf install -y webkit2gtk4.1-devel openssl-devel curl wget file \
  libappindicator-gtk3-devel librsvg2-devel libxdo-devel
# build tools (gcc, etc.)
sudo dnf group install -y "c-development"   # or: sudo dnf install -y @development-tools
# Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
# Node 20 (nvm recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
nvm install 20
```

**Package-name mapping (Ubuntu → Fedora):** `libwebkit2gtk-4.1-dev` → `webkit2gtk4.1-devel` ·
`libssl-dev` → `openssl-devel` · `librsvg2-dev` → `librsvg2-devel` ·
`libayatana-appindicator3-dev` → `libappindicator-gtk3-devel` · `libxdo-dev` → `libxdo-devel`.
Audio uses `pactl` (PipeWire), preinstalled on Workstation.

### 1.3 macOS

```bash
xcode-select --install
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
brew install node    # or nvm
```

### 1.4 Verify the toolchain

```bash
rustc --version      # e.g. rustc 1.8x
cargo --version
node --version       # v20+
npm --version
```
If `cargo` isn't found, restart your terminal (rustup updates `PATH` on install).

---

## 2. Get the code

If it's on GitHub (see [`GITHUB_SETUP.md`](GITHUB_SETUP.md) to create the repo):
```bash
git clone https://github.com/<org-or-user>/nexum.git
cd nexum
```
If you already have the folder, just:
```bash
cd path/to/nexum
```

---

## 3. Build & test the Rust core (no Node needed) — start here

This is the fastest way to confirm your environment works. From the repo root:

```bash
cargo build                                    # compile all crates + the cloud service
cargo test                                     # run all unit/integration tests
cargo test -p nexum-store --features sqlite    # also test the SQLite-backed store
cargo clippy --workspace --all-targets -- -D warnings   # lint (must be clean)
cargo fmt --all -- --check                     # formatting check
```
Expected: everything compiles and tests pass (engine, schema, store, automation,
marketplace, AI generator). The **first** `cargo build` downloads crates and can
take a few minutes — subsequent builds are fast.

> The desktop app (`apps/desktop/src-tauri`) is a **separate** Cargo workspace,
> so the root `cargo` commands above do **not** build it. That's intentional
> (keeps Tauri out of the core CI). You build it in step 5.

---

## 3.5 Regenerate the TypeScript types (ts-rs)

The frontend's types are **generated from the Rust structs**, so they can never
drift. The source of truth is `crates/nexum-schema` + `crates/nexum-core`; the
output lands in `packages/schema-ts/src/generated/` (which `apps/desktop` imports).

Regenerate whenever you change a `Mode`/action/automation/report type:

```bash
# from the repo root
cargo test -p nexum-schema --features ts
cargo test -p nexum-core   --features ts
# …or, from apps/desktop:  npm run gen:types
```

Then commit the changed files under `packages/schema-ts/src/generated/`. CI
(the **"TS bindings are up to date"** job) regenerates and fails the build if
you forgot — that's the anti-drift guarantee. Never hand-edit the generated
files; edit the Rust type and regenerate.

> The committed bindings shipped with the repo are hand-seeded approximations;
> the **first** `npm run gen:types` on a dev machine canonicalises them to
> exact ts-rs output (a cosmetic, one-time diff to commit).

---

## 4. Run the Cloud API

```bash
cargo run -p nexum-cloud
```
It prints `Nexum Cloud API listening on http://127.0.0.1:8787`. Test it (new terminal):

```bash
curl http://127.0.0.1:8787/health
# {"status":"ok","service":"nexum-cloud","version":"0.1.0"}

curl -X POST http://127.0.0.1:8787/api/ai/generate \
  -H "content-type: application/json" \
  -d "{\"prompt\":\"ranked gaming on steam\"}"
# returns a generated Mode (JSON)
```
Stop it with `Ctrl+C`.

**Optional — real AI (Claude):** build with the `claude` feature and set a key.
```bash
export ANTHROPIC_API_KEY=sk-ant-...     # Windows PowerShell: $env:ANTHROPIC_API_KEY="sk-ant-..."
cargo run -p nexum-cloud --features claude
```
Without the key (or the feature), the endpoint falls back to the built-in heuristic — no crash.

---

## 5. Run the Desktop app

```bash
cd apps/desktop
npm install          # first time only — installs frontend deps + Tauri CLI
npm run tauri dev    # compiles the Rust backend + starts the app with hot reload
```
The **first** `npm run tauri dev` compiles the Tauri backend (slow once, ~1–3 min);
after that it's quick. A window titled **Nexum** opens with three demo modes.

Try it:
- **Dashboard** → click **Activate** on a mode; watch the live event feed. Real
  actions fire (`system.open_url`, `gaming.launch_steam`); `audio.set_volume` works on Linux.
- **Mode Editor** → **+ New mode**, add steps, or type a prompt and click **✨ Generate with AI**.
- **Automations** → set 18:00 and **Fire tick** to auto-activate "Chill".
- **Marketplace** → pick a mode and **Assess risk**.

Frontend-only (browser, no native window):
```bash
npm run dev          # Vite dev server on http://localhost:1420
```

---

## 5.5 Run the tests

Three layers, matching the CI jobs:

```bash
# Rust unit/integration tests (from repo root) — engine, DSL, cloud, store
cargo test
cargo test -p nexum-cloud             # auth, sync store, remote-command queue

# Frontend unit tests (Vitest) — cloud sync + remote-control clients
cd apps/desktop && npm test
cd apps/mobile  && npm test           # the PWA's cloud client

# Desktop end-to-end (Playwright) — UI shell, tab nav, browser guard, sign-in flow
cd apps/desktop
npx playwright install chromium       # one-time: download the browser
npm run test:e2e                      # Playwright starts the Vite dev server itself
```

The E2E suite runs against the plain-browser preview with the network mocked, so
it needs no cloud or Tauri backend. See `apps/desktop/e2e/` and the `*.test.ts`
files next to the code they cover.

---

## 6. Build release installers

```bash
cd apps/desktop
npm run tauri build
```
Output installers land in `apps/desktop/src-tauri/target/release/bundle/`
(Windows `.msi`/`.exe`, Linux `.AppImage`/`.deb`, macOS `.dmg`). Icons are already
in `src-tauri/icons/`. For signing/auto-update see [`rncp/DEPLOYMENT_CICD.md`](rncp/DEPLOYMENT_CICD.md).

---

## 7. Optional feature flags & environment variables

| Feature | Crate | Turns on | Notes |
|---|---|---|---|
| `sqlite` | `nexum-store` | Persistent SQLite `ModeStore` | Needs a C compiler (bundled SQLite) |
| `hue` | `nexum-adapters` | Real Philips Hue adapter | Env: `NEXUM_HUE_BRIDGE`, `NEXUM_HUE_USER` |
| `claude` | `nexum-cloud` | Real Claude Mode-as-Code | Env: `ANTHROPIC_API_KEY` |

Enable a feature: `cargo build -p <crate> --features <feature>`.
To use the Hue adapter in the desktop app, add `features = ["hue"]` to the
`nexum-adapters` dependency in `apps/desktop/src-tauri/Cargo.toml` and register
`HueAdapter` in `build_state()`.

---

## 8. Command cheat-sheet

```bash
# from repo root (nexum/)
cargo build                     # build core + cloud
cargo test                      # run tests
cargo clippy --workspace --all-targets -- -D warnings
cargo fmt --all                 # auto-format
cargo run -p nexum-cloud        # start the API

# from apps/desktop
npm install                     # install JS deps (first time)
npm run tauri dev               # run the desktop app (dev)
npm run tauri build             # build installers
npm run dev                     # frontend only (browser)
npm run build                   # typecheck + build frontend bundle
```

---

## 9. Troubleshooting

| Symptom | Fix |
|---|---|
| `cargo: command not found` | Restart the terminal after installing rustup (PATH). |
| Tauri build fails on Linux (`webkit2gtk` not found) | Re-run the `apt install` line in §1.2. |
| `sqlite` feature fails to compile | No C compiler — install Build Tools (Win) / `build-essential` (Linux). |
| `npm run tauri dev` — "webview2 not found" (Windows) | Install the WebView2 Evergreen runtime. |
| Blank/white window on Linux/Wayland | Already handled in `src-tauri/src/main.rs` (`WEBKIT_DISABLE_DMABUF_RENDERER`). |
| Port 1420 or 8787 already in use | Close the other process, or change the port in `vite.config.ts` / `nexum-cloud/src/main.rs`. |
| Clippy fails with warnings | Run `cargo clippy --workspace --fix` or address the reported lints. |

---

## 10. Project layout (quick reference)

```
nexum/
├── crates/
│   ├── nexum-schema     # Mode/Action DSL — the shared data model
│   ├── nexum-core       # Engine, registry, event bus, automation, marketplace, AI
│   ├── nexum-adapters   # System / Gaming / Audio / Display / Hue integrations
│   └── nexum-store      # ModeStore trait + in-memory + SQLite (feature)
├── services/nexum-cloud # axum REST API
├── apps/desktop         # Tauri 2 + React app (own cargo workspace)
├── packages/schema-ts   # TypeScript mirror of the DSL
└── docs/                # this documentation
```

---

## 11. Contributing

Branch (`feat/…`, `fix/…`), run the checks in §3 before pushing, open a PR (the
CI in `.github/workflows/ci.yml` runs fmt + clippy + tests). Full rules:
[`../CONTRIBUTING.md`](../CONTRIBUTING.md). Adding a new integration? The steps
are in CONTRIBUTING — you add an adapter and register it; the engine never changes.
```

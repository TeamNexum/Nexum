# Getting started — Nexum

How to install everything and launch the project from scratch.

## 1. Prerequisites (what to download)

| Tool | Why | Install |
|---|---|---|
| **Rust** (stable) | Core, adapters, cloud, Tauri backend | https://rustup.rs |
| **Node.js 20+ & npm** | Desktop frontend + Tauri CLI | https://nodejs.org |
| **Tauri OS deps** | Build the desktop app | https://tauri.app/start/prerequisites/ |
| **Git** | Version control | https://git-scm.com |
| A **C compiler** | Needed by the `sqlite` feature (bundled SQLite) & Tauri | see below |

### OS-specific

**Windows**
- Install **Visual Studio Build Tools** with "Desktop development with C++" (MSVC + Windows SDK).
- Install **WebView2 runtime** (usually already present on Win10/11).

**Linux (Debian/Ubuntu)**
```bash
sudo apt update
sudo apt install -y libwebkit2gtk-4.1-dev build-essential curl wget file \
  libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev pkg-config
# audio adapter uses pactl (PipeWire/PulseAudio), usually preinstalled
```

**Linux (Fedora / RHEL — `dnf`)**
```bash
sudo dnf install -y webkit2gtk4.1-devel openssl-devel curl wget file \
  libappindicator-gtk3-devel librsvg2-devel libxdo-devel
sudo dnf group install -y "c-development"   # build tools (or: sudo dnf install -y @development-tools)
# audio adapter uses pactl (PipeWire), preinstalled on Workstation
```
> `apt` is not Fedora's package manager — use `dnf`. Name mapping: `libwebkit2gtk-4.1-dev`→`webkit2gtk4.1-devel`, `libssl-dev`→`openssl-devel`, `librsvg2-dev`→`librsvg2-devel`, `libayatana-appindicator3-dev`→`libappindicator-gtk3-devel`, `libxdo-dev`→`libxdo-devel`.

**macOS**
```bash
xcode-select --install
```

Verify:
```bash
rustc --version && cargo --version && node --version && npm --version
```

## 2. Build & test the core (no Node required)

```bash
cd nexum
cargo build                                   # all crates + cloud
cargo test                                    # engine, schema, store, automation, marketplace, ai
cargo test -p nexum-store --features sqlite   # SQLite-backed store
cargo clippy --workspace --all-targets -- -D warnings
cargo fmt --all -- --check
```

## 3. Run the cloud API

```bash
cargo run -p nexum-cloud
# GET  http://127.0.0.1:8787/health
# POST http://127.0.0.1:8787/api/ai/generate   body: {"prompt":"ranked gaming on steam"}
```

## 4. Run the desktop app

```bash
cd nexum/apps/desktop
npm install
npm run tauri dev        # launches the Tauri window with hot reload
```

The app opens on the **Dashboard** with three demo modes. Explore:
- **Dashboard** — activate a mode; watch the live event feed (real engine results).
- **Mode Editor** — build a mode with no code; try **✨ Generate with AI** ("chill music").
- **Automations** — fire a simulated clock tick at 18:00 to auto-trigger "Chill".
- **Marketplace** — assess a mode's risk.

### Optional features

**Persistence (SQLite):** swap `InMemoryStore` for `SqliteStore` in
`apps/desktop/src-tauri/src/lib.rs` and add `features = ["sqlite"]` to the
`nexum-store` dependency there.

**Real Philips Hue:** enable the adapter and set env vars.
```bash
# in apps/desktop/src-tauri/Cargo.toml: nexum-adapters = { path = "...", features = ["hue"] }
# then register HueAdapter in build_state() instead of the Hue mock, and:
export NEXUM_HUE_BRIDGE=192.168.1.42
export NEXUM_HUE_USER=<your-hue-api-username>
```

## 5. Build a release

```bash
cd nexum/apps/desktop
npm run tauri build      # produces installers under src-tauri/target/release/bundle/
```

## Troubleshooting

- **`cargo` not found** → restart the terminal after installing rustup (PATH).
- **Tauri build fails on Linux** → missing `libwebkit2gtk`; re-check the apt list above.
- **`sqlite` feature fails** → no C compiler; install Build Tools (Win) / `build-essential` (Linux).
- **Blank window on Linux/Wayland** → already handled in `main.rs` (`WEBKIT_DISABLE_DMABUF_RENDERER`).

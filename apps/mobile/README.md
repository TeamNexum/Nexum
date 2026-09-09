# Nexum Mobile — companion PWA

A phone can't launch Steam or set your PC's volume, so the companion is a **remote
control**, not a port: pick a mode on your phone → your PC runs it. It's an
installable **PWA** (approach B from the original plan) built on the cloud API.

```
Phone (PWA)  ──POST /api/commands──▶  Cloud API  ◀──GET /api/commands/next──  Desktop app
   tap "Gaming"                       (per-user queue)                        runs the mode locally
```

Stack: Vite + React + TypeScript. No Rust mobile toolchain, no app store. Types
are imported from `@nexum/schema` (generated from Rust), so it can't drift.

## Run it (dev)

Prerequisite: the **Cloud API** must be reachable from the phone, so bind it to
the LAN (not just localhost) and note your PC's LAN IP (`ip addr` / `ipconfig`):

```bash
# terminal 1 — cloud, exposed on the LAN
cd nexum
NEXUM_CLOUD_ADDR=0.0.0.0:8787 cargo run -p nexum-cloud

# terminal 2 — the PWA dev server (also exposed on the LAN)
cd nexum/apps/mobile
npm install
npm run dev        # Vite prints a Network URL like http://192.168.1.x:1421
```

On your phone (same Wi-Fi): open the Network URL, set **Serveur** to
`http://<PC-LAN-IP>:8787`, sign in with the **same account** you used on the
desktop (☁️ Account & Sync), and tap a mode. Add it to your home screen to
install it as an app.

> The desktop must be running, signed in to the same account, and will pick up
> the command within a couple of seconds (it polls the queue).

## Build

```bash
npm run build      # → dist/ (static; host anywhere with HTTPS for full PWA install)
```

## How it works
- `src/cloud.ts` — REST client: `register`/`login` (JWT in `localStorage`),
  `modes()` (GET `/api/modes`), `activate()` (POST `/api/commands`).
- `src/App.tsx` — sign-in screen, then a grid of the account's modes; a tap
  enqueues an `activate_mode` command.
- `public/sw.js` + `public/manifest.webmanifest` — offline shell + installability.
- The desktop side that consumes the queue is `apps/desktop/src/remote.ts`.

## Not included (future)
- **Geolocation triggers** ("arriving home → Chill"): the engine already models
  `SystemEvent::LocationEntered` / `Trigger::LocationEntered`; the PWA would POST
  location events and the desktop would evaluate them. Left for Phase 2.
- Real PNG icons (currently an SVG icon); production install benefits from
  192/512 PNGs + HTTPS hosting.

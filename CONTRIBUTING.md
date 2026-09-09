# Contributing to Nexum

Thanks for contributing! This guide covers setup, conventions, and the PR flow.

## Prerequisites

See [`docs/GETTING_STARTED.md`](docs/GETTING_STARTED.md) for the full toolchain
install (Rust, Node, Tauri OS deps).

## Project layout

- `crates/` — Rust core (`nexum-schema`, `nexum-core`, `nexum-adapters`, `nexum-store`).
- `services/nexum-cloud` — cloud API.
- `apps/desktop` — Tauri 2 + React app (its own cargo workspace).
- `packages/schema-ts` — TypeScript mirror of the DSL.
- `docs/` — architecture, EIP, RNCP, and brand docs.

## Before you push

```bash
cargo fmt --all
cargo clippy --workspace --all-targets -- -D warnings
cargo test --workspace
cargo test -p nexum-store --features sqlite
# frontend
cd apps/desktop && npm run build
```
CI runs the same checks (`.github/workflows/ci.yml`).

## Branch & commit conventions

- Branches: `feat/<short-desc>`, `fix/<short-desc>`, `docs/<short-desc>`, `chore/<short-desc>`.
- Commits: [Conventional Commits](https://www.conventionalcommits.org) —
  `feat(adapters): add philips hue scene activation`.
- Never commit directly to `main`. Open a PR; at least one review required.

## Adding a new integration (adapter)

1. Add the `action_type` id(s) + param struct(s) to `nexum-schema`.
2. Implement the `Adapter` trait in `nexum-adapters` (one file per integration).
3. Register the adapter in the desktop app's `build_state()`.
4. Add param-form fields for the editor in `apps/desktop/src/components/ModeEditor.tsx`.
5. Add a unit test and update the adapter status table in the root `README.md`.

The engine never changes when you add an integration — that's by design.

## Architecture Decision Records

Significant decisions are recorded in [`docs/adr/`](docs/adr/). Add a new ADR
when you make a decision that's hard to reverse or that future contributors
will question.

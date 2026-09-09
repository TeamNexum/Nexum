# @nexum/schema

TypeScript types for the Nexum DSL and engine, **generated from Rust** so they
can never silently drift from the backend.

## Source of truth

The Rust structs/enums are canonical:

- `crates/nexum-schema` — `Mode`, `ActionStep`, `Category`, `OnError`,
  `AutomationRule`, `Trigger`, `Condition`, `SystemEvent`
- `crates/nexum-core` — `EngineEvent`, `ExecutionReport`, `StepReport`,
  `RiskReport`, `RiskLevel`

Each is annotated with `#[cfg_attr(feature = "ts", derive(ts_rs::TS))]` and
exports to `src/generated/` when the `ts` Cargo feature is on.

## Regenerate

From `apps/desktop`:

```bash
npm run gen:types
```

or, from the workspace root (`nexum/`):

```bash
cargo test -p nexum-schema --features ts
cargo test -p nexum-core   --features ts
```

This overwrites the per-type files in `src/generated/`. **Never edit those by
hand.** `src/generated/index.ts` is the one hand-maintained file (a barrel);
add a line there when you introduce a new `#[ts(export)]` type.

## Guardrail

CI (`.github/workflows/ci.yml`, job **"TS bindings are up to date"**)
regenerates the bindings and fails if the committed files differ — so a change
to a Rust type that isn't accompanied by a regenerated binding blocks the PR.

## Consumers

- `apps/desktop/src/types.ts` re-exports these (the desktop app imports its
  types straight from here).
- The mobile companion and any future TS client should import from
  `@nexum/schema` too.

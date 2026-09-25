// Canonical TypeScript view of the Nexum DSL + engine/marketplace types.
//
// The Rust crates `crates/nexum-schema` and `crates/nexum-core` are the SINGLE
// SOURCE OF TRUTH. The type definitions under `./generated/` are emitted from
// them by ts-rs — regenerate with `npm run gen:types` (or, from the workspace
// root, `cargo test -p nexum-schema -p nexum-core --features ts`). Never edit
// the generated files by hand.

export type {
  Category,
  OnError,
  ActionStep,
  Mode,
  Trigger,
  Condition,
  AutomationRule,
  SystemEvent,
  StepReport,
  ExecutionReport,
  RiskLevel,
  RiskReport,
  ImportPreview,
  EngineEvent,
} from "./generated";

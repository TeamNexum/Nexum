// The desktop app's types come straight from the ts-rs generated bindings, so
// they can never drift from the Rust source of truth (crates/nexum-schema +
// crates/nexum-core). Regenerate with `npm run gen:types`.
//
// Do NOT redefine these types here by hand — edit the Rust structs and regenerate.

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
  EngineEvent,
} from "../../../packages/schema-ts/src/generated";

import type { Category } from "../../../packages/schema-ts/src/generated";

/** All mode categories, for pickers/menus. */
export const CATEGORIES: Category[] = ["gaming", "work", "chill", "streaming", "night", "custom"];

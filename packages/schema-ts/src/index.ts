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
  EngineEvent,
} from "./generated";

import type { Category } from "./generated";

/** All mode categories, for pickers/menus (runtime value — not generated). */
export const CATEGORIES: Category[] = ["gaming", "work", "chill", "streaming", "night", "custom"];

/** Well-known action_type ids (mirror of nexum_schema::action_types::ids). */
export const ActionTypes = {
  systemLaunchApp: "system.launch_app",
  systemCloseApp: "system.close_app",
  systemOpenUrl: "system.open_url",
  audioSetVolume: "audio.set_volume",
  displaySetBrightness: "display.set_brightness",
  gamingLaunchSteam: "gaming.launch_steam",
  gamingLaunchEpic: "gaming.launch_epic",
  gamingLaunchGog: "gaming.launch_gog",
  iotHueActivateScene: "iot.hue.activate_scene",
  peripheralApplyRgbProfile: "peripheral.apply_rgb_profile",
} as const;

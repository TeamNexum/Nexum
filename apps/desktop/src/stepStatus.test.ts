import { expect, test } from "vitest";
import { friendlyReason, runHeadline, statusOf, summarize } from "./stepStatus";
import type { ExecutionReport } from "./types";

function report(steps: ExecutionReport["steps"]): ExecutionReport {
  return { mode_id: "m", success: steps.every(s => s.success), steps };
}

test("falls back to success when a report has no status", () => {
  expect(statusOf({ success: true })).toBe("ok");
  expect(statusOf({ success: false })).toBe("failed");
  expect(statusOf({ success: false, status: "unavailable" })).toBe("unavailable");
});

test("translates the engine's reasons", () => {
  expect(friendlyReason("adapter unavailable: disabled by the user")).toBe("désactivée dans les réglages");
  expect(friendlyReason("adapter unavailable: volume control not yet implemented on this OS"))
    .toBe("non prise en charge sur ce système");
  expect(friendlyReason("adapter unavailable: Hue bridge not paired")).toBe("pont Hue non appairé");
  expect(friendlyReason("brightness control failed: timeout")).toBe("timeout");
});

test("puts failures before unavailable steps in the summary", () => {
  const s = summarize(report([
    { order: 1, action_type: "audio.set_volume", success: false, status: "unavailable", message: "adapter unavailable: disabled by the user" },
    { order: 2, action_type: "system.launch_app", success: false, status: "failed", message: "could not launch Steam" },
    { order: 3, action_type: "display.set_brightness", success: true, status: "ok", message: "ok" },
  ]));
  expect(s).toMatchObject({ total: 3, ok: 1, failed: 1, unavailable: 1 });
  expect(s.firstProblem).toMatch(/could not launch Steam$/);
  expect(runHeadline(s)).toBe("1 action en échec");
});

test("says when steps were only skipped", () => {
  const s = summarize(report([
    { order: 1, action_type: "audio.set_volume", success: false, status: "unavailable", message: "adapter unavailable: disabled by the user" },
    { order: 2, action_type: "hue.set_scene", success: false, status: "unavailable", message: "adapter unavailable: Hue bridge not paired" },
  ]));
  expect(runHeadline(s)).toBe("2 actions indisponibles sur cette machine");
  expect(s.firstProblem).toMatch(/désactivée dans les réglages$/);
});

test("reports a clean run", () => {
  expect(runHeadline(summarize(report([
    { order: 1, action_type: "audio.set_volume", success: true, status: "ok", message: "volume set" },
  ])))).toBe("Profil activé");
});

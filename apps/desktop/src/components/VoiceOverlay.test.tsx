import { describe, expect, it } from "vitest";
import { voiceMessage } from "./VoiceOverlay";

describe("voiceMessage", () => {
  it("shows the live states", () => {
    expect(voiceMessage({ state: "listening" })?.level).toBe("live");
    expect(voiceMessage({ state: "transcribing" })?.level).toBe("live");
  });

  it("names the activated mode", () => {
    expect(voiceMessage({ state: "done", transcript: "lance gaming", mode: "Gaming", candidates: [] })).toEqual({
      level: "ok",
      text: "« lance gaming » → Gaming",
    });
  });

  it("warns when nothing matched", () => {
    expect(voiceMessage({ state: "done", transcript: "bonjour", mode: null, candidates: [] })?.level).toBe("warn");
  });

  it("lists the candidates when several modes match", () => {
    const msg = voiceMessage({ state: "done", transcript: "travail", mode: null, candidates: ["Work", "Focus & Code"] });
    expect(msg?.level).toBe("warn");
    expect(msg?.text).toContain("Work, Focus & Code");
  });

  it("keeps download progress out of the overlay", () => {
    expect(voiceMessage({ state: "download", downloaded: 1, total: 2 })).toBeNull();
  });
});

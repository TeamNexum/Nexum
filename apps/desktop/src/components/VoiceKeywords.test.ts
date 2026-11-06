import { describe, expect, it } from "vitest";
import { addKeyword } from "./VoiceKeywords";

describe("addKeyword", () => {
  it("adds a trimmed keyword", () => {
    expect(addKeyword(["jeu"], "  partie classée ")).toEqual(["jeu", "partie classée"]);
  });

  it("ignores empty input and duplicates", () => {
    expect(addKeyword(["jeu"], "   ")).toEqual(["jeu"]);
    expect(addKeyword(["Jeu"], "jeu")).toEqual(["Jeu"]);
  });
});

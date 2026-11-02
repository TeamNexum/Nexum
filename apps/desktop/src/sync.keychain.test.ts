import { beforeEach, describe, expect, it, vi } from "vitest";

const keychain = vi.hoisted(() => ({
  value: null as string | null,
  loads: 0,
  failing: false,
}));

vi.mock("./api", () => ({
  IS_DESKTOP: true,
  api: {
    loadCloudToken: async () => {
      keychain.loads++;
      return keychain.value;
    },
    saveCloudToken: async (token: string) => {
      if (keychain.failing) throw new Error("no keychain");
      keychain.value = token;
    },
    clearCloudToken: async () => {
      keychain.value = null;
    },
  },
}));

import { clearSession, cloud, isSessionPersisted, isSignedIn, loadSession } from "./sync";

function ok(body: unknown) {
  return { ok: true, status: 200, json: async () => body } as unknown as Response;
}

const session = { token: "access", refresh_token: "refresh", user_id: "user" };

beforeEach(async () => {
  await clearSession();
  localStorage.clear();
  keychain.failing = false;
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(ok(session)));
});

describe("on desktop", () => {
  it("keeps the refresh token in the keychain, not in localStorage", async () => {
    await cloud.login("a@b.com", "pw");
    expect(keychain.value).toBe("refresh");
    expect(JSON.stringify(localStorage)).not.toContain("refresh");
    expect(isSessionPersisted()).toBe(true);
  });

  it("restores the session from the keychain", async () => {
    keychain.value = "stored";
    localStorage.setItem("nexum.cloud.user", "user");
    expect(isSignedIn()).toBe(false);
    await loadSession();
    expect(isSignedIn()).toBe(true);
  });

  it("doesn't touch the keychain for someone who never signed in", async () => {
    keychain.loads = 0;
    await loadSession();
    expect(keychain.loads).toBe(0);
    expect(isSignedIn()).toBe(false);
  });

  it("still signs in without a keychain, and says it won't last", async () => {
    keychain.failing = true;
    await cloud.login("a@b.com", "pw");
    expect(isSignedIn()).toBe(true);
    expect(isSessionPersisted()).toBe(false);
    expect(JSON.stringify(localStorage)).not.toContain("refresh");
  });
});

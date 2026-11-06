import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cloud, cloudUrl, isSignedIn, setCloudUrl } from "./cloud";

function res(status: number, body: unknown = null) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as unknown as Response;
}

const session = { token: "tok", refresh_token: "next" };

const fetchMock = vi.fn();

beforeEach(async () => {
  vi.stubGlobal("fetch", fetchMock);
  fetchMock.mockReset();
  fetchMock.mockResolvedValue(res(204));
  await cloud.signOut(); // also forgets the access token kept in memory
  localStorage.clear();
  fetchMock.mockReset();
});

function signedInWithRefreshToken() {
  localStorage.setItem("nexum.cloud.refresh", "stored");
  fetchMock.mockResolvedValueOnce(res(200, session));
}
afterEach(() => vi.unstubAllGlobals());

describe("mobile cloud client", () => {
  it("normalizes the server URL", () => {
    setCloudUrl("http://192.168.1.10:8787/");
    expect(cloudUrl()).toBe("http://192.168.1.10:8787");
  });

  it("login keeps the refresh token, not the access token", async () => {
    fetchMock.mockResolvedValue(res(200, session));
    await cloud.login("a@b.com", "pw");
    expect(localStorage.getItem("nexum.cloud.refresh")).toBe("next");
    expect(JSON.stringify(localStorage)).not.toContain("tok");
    expect(isSignedIn()).toBe(true);
  });

  it("explains each login refusal", async () => {
    const cases: [number, RegExp][] = [
      [400, /8 caractères minimum/],
      [401, /mot de passe incorrect/],
      [409, /déjà utilisé/],
    ];
    for (const [status, message] of cases) {
      fetchMock.mockResolvedValue(res(status));
      await expect(cloud.register("a@b.com", "pw")).rejects.toThrow(message);
      expect(isSignedIn()).toBe(false);
    }
  });

  it("modes() renews the access token, then sends it and returns the array", async () => {
    signedInWithRefreshToken();
    const mode = { id: "1", name: "Ranked", description: null, category: "gaming", steps: [] };
    fetchMock.mockResolvedValueOnce(res(200, [mode]));
    await expect(cloud.modes()).resolves.toEqual([mode]);
    const [refreshUrl, refreshInit] = fetchMock.mock.calls[0];
    expect(String(refreshUrl)).toMatch(/\/api\/auth\/refresh$/);
    expect(JSON.parse(refreshInit.body)).toEqual({ refresh_token: "stored" });
    const [url, init] = fetchMock.mock.calls[1];
    expect(String(url)).toMatch(/\/api\/modes$/);
    expect(init.headers.authorization).toBe("Bearer tok");
    expect(localStorage.getItem("nexum.cloud.refresh")).toBe("next");
  });

  it("activate() posts an activate_mode command", async () => {
    signedInWithRefreshToken();
    fetchMock.mockResolvedValueOnce(res(202));
    await cloud.activate("mode-42");
    const [url, init] = fetchMock.mock.calls[1];
    expect(String(url)).toMatch(/\/api\/commands$/);
    expect(init.method).toBe("POST");
    expect(init.headers.authorization).toBe("Bearer tok");
    expect(JSON.parse(init.body)).toEqual({ kind: "activate_mode", mode_id: "mode-42" });
  });

  it("renews an expired access token and retries", async () => {
    signedInWithRefreshToken();
    fetchMock.mockResolvedValueOnce(res(200, []));
    await cloud.modes();
    fetchMock
      .mockResolvedValueOnce(res(401))
      .mockResolvedValueOnce(res(200, session))
      .mockResolvedValueOnce(res(200, []));
    await expect(cloud.modes()).resolves.toEqual([]);
  });

  it("signs out when the server refuses the refresh token", async () => {
    localStorage.setItem("nexum.cloud.refresh", "stored");
    fetchMock.mockResolvedValue(res(401));
    await expect(cloud.modes()).rejects.toThrow(/Session expirée/);
    expect(isSignedIn()).toBe(false);
  });

  it("stays signed in when the cloud is merely unreachable", async () => {
    localStorage.setItem("nexum.cloud.refresh", "stored");
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));
    await expect(cloud.modes()).rejects.toThrow();
    expect(isSignedIn()).toBe(true);
  });

  it("signOut revokes the session on the server", async () => {
    localStorage.setItem("nexum.cloud.refresh", "stored");
    fetchMock.mockResolvedValue(res(204));
    await cloud.signOut();
    expect(isSignedIn()).toBe(false);
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toMatch(/\/api\/auth\/logout$/);
    expect(JSON.parse(init.body)).toEqual({ refresh_token: "stored" });
  });
});

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cloud, cloudUrl, isSignedIn, setCloudUrl, token } from "./cloud";

function res(status: number, body: unknown = null) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as unknown as Response;
}

const fetchMock = vi.fn();

beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal("fetch", fetchMock);
  fetchMock.mockReset();
});
afterEach(() => vi.unstubAllGlobals());

describe("mobile cloud client", () => {
  it("normalizes the server URL", () => {
    setCloudUrl("http://192.168.1.10:8787/");
    expect(cloudUrl()).toBe("http://192.168.1.10:8787");
  });

  it("login stores the token", async () => {
    fetchMock.mockResolvedValue(res(200, { token: "tok" }));
    await cloud.login("a@b.com", "pw");
    expect(token()).toBe("tok");
    expect(isSignedIn()).toBe(true);
  });

  it("modes() sends the bearer token and returns the array", async () => {
    localStorage.setItem("nexum.cloud.token", "tok");
    const mode = { id: "1", name: "Ranked", description: null, category: "gaming", steps: [] };
    fetchMock.mockResolvedValue(res(200, [mode]));
    await expect(cloud.modes()).resolves.toEqual([mode]);
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toMatch(/\/api\/modes$/);
    expect(init.headers.authorization).toBe("Bearer tok");
  });

  it("activate() posts an activate_mode command", async () => {
    localStorage.setItem("nexum.cloud.token", "tok");
    fetchMock.mockResolvedValue(res(202));
    await cloud.activate("mode-42");
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toMatch(/\/api\/commands$/);
    expect(init.method).toBe("POST");
    expect(init.headers.authorization).toBe("Bearer tok");
    expect(JSON.parse(init.body)).toEqual({ kind: "activate_mode", mode_id: "mode-42" });
  });

  it("maps 401 to a session-expired error", async () => {
    localStorage.setItem("nexum.cloud.token", "tok");
    fetchMock.mockResolvedValue(res(401));
    await expect(cloud.modes()).rejects.toThrow(/Session expirée/);
  });
});

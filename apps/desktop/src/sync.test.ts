import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cloud, cloudUrl, isSignedIn, setCloudUrl, signOut, token } from "./sync";
import type { Mode } from "./types";

// Minimal fetch Response stand-in so tests don't depend on the runtime's global.
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

describe("cloudUrl", () => {
  it("has a default and normalizes trailing slashes", () => {
    expect(cloudUrl()).toMatch(/^http/);
    setCloudUrl("http://example.com:8787///");
    expect(cloudUrl()).toBe("http://example.com:8787");
  });
});

describe("auth", () => {
  it("register stores the returned token", async () => {
    fetchMock.mockResolvedValue(res(200, { token: "abc" }));
    expect(isSignedIn()).toBe(false);
    await cloud.register("a@b.com", "pw");
    expect(token()).toBe("abc");
    expect(isSignedIn()).toBe(true);
  });

  it("login posts credentials to the login endpoint", async () => {
    fetchMock.mockResolvedValue(res(200, { token: "t2" }));
    await cloud.login("a@b.com", "pw");
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toMatch(/\/api\/auth\/login$/);
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body)).toEqual({ email: "a@b.com", password: "pw" });
  });

  it("maps 409 to a friendly 'email taken' error", async () => {
    fetchMock.mockResolvedValue(res(409));
    await expect(cloud.register("a@b.com", "pw")).rejects.toThrow(/déjà utilisé/);
    expect(isSignedIn()).toBe(false);
  });

  it("surfaces a clear message when the cloud is unreachable", async () => {
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));
    await expect(cloud.login("a@b.com", "pw")).rejects.toThrow(/Impossible de joindre/);
  });
});

describe("sync", () => {
  const mode: Mode = { id: "1", name: "M", description: null, category: "gaming", steps: [] };

  it("push sends the bearer token, PUT, and the modes body", async () => {
    localStorage.setItem("nexum.cloud.token", "tok");
    fetchMock.mockResolvedValue(res(204));
    await cloud.push([mode]);
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toMatch(/\/api\/modes$/);
    expect(init.method).toBe("PUT");
    expect(init.headers.authorization).toBe("Bearer tok");
    expect(JSON.parse(init.body)).toHaveLength(1);
  });

  it("pull returns the modes array", async () => {
    localStorage.setItem("nexum.cloud.token", "tok");
    fetchMock.mockResolvedValue(res(200, [mode]));
    await expect(cloud.pull()).resolves.toEqual([mode]);
  });

  it("pull maps 401 to a 'session expired' error", async () => {
    localStorage.setItem("nexum.cloud.token", "tok");
    fetchMock.mockResolvedValue(res(401));
    await expect(cloud.pull()).rejects.toThrow(/Session expirée/);
  });

  it("signOut clears the token", () => {
    localStorage.setItem("nexum.cloud.token", "tok");
    expect(isSignedIn()).toBe(true);
    signOut();
    expect(isSignedIn()).toBe(false);
  });
});

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { authedFetch, clearSession, cloud, cloudUrl, currentUser, isSignedIn, loadSession, setCloudUrl, signOut } from "./sync";
import type { Mode } from "./types";

// Minimal fetch Response stand-in so tests don't depend on the runtime's global.
function res(status: number, body: unknown = null) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as unknown as Response;
}

const session = (n = 1) => ({ token: `access${n}`, refresh_token: `refresh${n}`, user_id: "user" });

const fetchMock = vi.fn();

function urls() {
  return fetchMock.mock.calls.map(([url]) => String(url).replace(/^.*\/api/, "/api"));
}

beforeEach(async () => {
  await clearSession();
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
  it("register keeps the refresh token and the account id", async () => {
    fetchMock.mockResolvedValue(res(200, session()));
    expect(isSignedIn()).toBe(false);
    await cloud.register("a@b.com", "longenough");
    expect(localStorage.getItem("nexum.cloud.refresh")).toBe("refresh1");
    expect(currentUser()).toBe("user");
    expect(isSignedIn()).toBe(true);
  });

  it("login posts credentials to the login endpoint", async () => {
    fetchMock.mockResolvedValue(res(200, session()));
    await cloud.login("a@b.com", "pw");
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toMatch(/\/api\/auth\/login$/);
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body)).toEqual({ email: "a@b.com", password: "pw" });
  });

  it("explains each refusal", async () => {
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

  it("surfaces a clear message when the cloud is unreachable", async () => {
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));
    await expect(cloud.login("a@b.com", "pw")).rejects.toThrow(/Impossible de joindre/);
  });

  it("signOut clears the session and revokes it on the server", async () => {
    fetchMock.mockResolvedValue(res(200, session()));
    await cloud.login("a@b.com", "pw");
    fetchMock.mockResolvedValue(res(204));
    await signOut();
    expect(isSignedIn()).toBe(false);
    expect(localStorage.getItem("nexum.cloud.refresh")).toBeNull();
    const [url, init] = fetchMock.mock.calls.at(-1)!;
    expect(String(url)).toMatch(/\/api\/auth\/logout$/);
    expect(JSON.parse(init.body)).toEqual({ refresh_token: "refresh1" });
  });
});

describe("token refresh", () => {
  async function signIn() {
    fetchMock.mockResolvedValueOnce(res(200, session()));
    await cloud.login("a@b.com", "pw");
    fetchMock.mockClear();
  }

  it("uses the access token while it is valid", async () => {
    await signIn();
    fetchMock.mockResolvedValue(res(200));
    await authedFetch("/api/modes");
    expect(urls()).toEqual(["/api/modes"]);
    expect(fetchMock.mock.calls[0][1].headers.authorization).toBe("Bearer access1");
  });

  it("gets an access token from the stored refresh token after a restart", async () => {
    localStorage.setItem("nexum.cloud.refresh", "stored");
    localStorage.setItem("nexum.cloud.user", "user");
    fetchMock.mockResolvedValueOnce(res(200, session(2))).mockResolvedValue(res(200));
    await authedFetch("/api/modes");
    expect(urls()).toEqual(["/api/auth/refresh", "/api/modes"]);
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ refresh_token: "stored" });
    expect(fetchMock.mock.calls[1][1].headers.authorization).toBe("Bearer access2");
    expect(localStorage.getItem("nexum.cloud.refresh")).toBe("refresh2");
  });

  it("renews an expired access token and retries the request", async () => {
    await signIn();
    fetchMock
      .mockResolvedValueOnce(res(401))
      .mockResolvedValueOnce(res(200, session(2)))
      .mockResolvedValueOnce(res(200));
    const response = await authedFetch("/api/modes");
    expect(response.status).toBe(200);
    expect(urls()).toEqual(["/api/modes", "/api/auth/refresh", "/api/modes"]);
    expect(fetchMock.mock.calls[2][1].headers.authorization).toBe("Bearer access2");
  });

  it("refreshes once for simultaneous requests, since a token only works once", async () => {
    await signIn();
    fetchMock.mockImplementation(async (url: string, init: RequestInit) => {
      if (url.endsWith("/refresh")) return res(200, session(2));
      const bearer = (init.headers as Record<string, string>).authorization;
      return res(bearer === "Bearer access2" ? 200 : 401);
    });
    await Promise.all([authedFetch("/api/modes"), authedFetch("/api/commands/next")]);
    expect(urls().filter((u) => u.endsWith("/refresh"))).toHaveLength(1);
  });

  it("signs out when the server refuses the refresh token", async () => {
    await signIn();
    fetchMock.mockResolvedValueOnce(res(401)).mockResolvedValueOnce(res(401));
    await expect(authedFetch("/api/modes")).rejects.toThrow(/Session expirée/);
    expect(isSignedIn()).toBe(false);
  });

  it("stays signed in when the cloud is merely unreachable", async () => {
    await signIn();
    fetchMock.mockResolvedValueOnce(res(401)).mockRejectedValueOnce(new TypeError("Failed to fetch"));
    await expect(authedFetch("/api/modes")).rejects.toThrow();
    expect(isSignedIn()).toBe(true);
    expect(localStorage.getItem("nexum.cloud.refresh")).toBe("refresh1");
  });
});

describe("syncModes", () => {
  const mode: Mode = { id: "1", name: "M", description: null, category: "gaming", steps: [] } as Mode;

  it("posts the changes with the bearer token", async () => {
    fetchMock.mockResolvedValueOnce(res(200, session()));
    await cloud.login("a@b.com", "pw");
    fetchMock.mockResolvedValueOnce(res(200, { modes: [{ revision: 1, mode }], conflicts: [] }));
    const changes = [{ id: "1", base_revision: 0, mode }];
    await expect(cloud.syncModes(changes)).resolves.toEqual({ modes: [{ revision: 1, mode }], conflicts: [] });
    const [url, init] = fetchMock.mock.calls[1];
    expect(String(url)).toMatch(/\/api\/modes\/sync$/);
    expect(init.method).toBe("POST");
    expect(init.headers.authorization).toBe("Bearer access1");
    expect(JSON.parse(init.body)).toEqual({ changes });
  });
});

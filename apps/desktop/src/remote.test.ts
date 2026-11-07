import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { isRemoteCommand, setDirectEnabled, startRemoteControl, syncDirectModes, type RemoteCommand } from "./remote";
import { clearSession } from "./sync";

function res(body: unknown) {
  return { ok: true, status: 200, json: async () => body } as unknown as Response;
}

const session = { token: "access", refresh_token: "next", user_id: "u" };
const CHILL = "00000000-0000-4000-8000-000000000001";
const GAMING = "00000000-0000-4000-8000-000000000002";

const fetchMock = vi.fn();

beforeEach(async () => {
  await clearSession();
  localStorage.clear();
  vi.stubGlobal("fetch", fetchMock);
  fetchMock.mockReset();
});
afterEach(() => vi.unstubAllGlobals());

describe("startRemoteControl", () => {
  it("ignores the direct (no-account) queue unless it was turned on", async () => {
    fetchMock.mockResolvedValue(res({ command: { kind: "activate_mode", mode_id: CHILL } }));
    const seen: RemoteCommand[] = [];
    const stop = startRemoteControl((c) => seen.push(c), 10_000);
    await new Promise((r) => setTimeout(r, 30));
    expect(fetchMock).not.toHaveBeenCalled();
    expect(seen).toHaveLength(0);
    stop();
  });

  it("only polls the direct queue while signed out, once enabled", async () => {
    localStorage.setItem("nexum.direct.enabled", "true");
    fetchMock
      .mockResolvedValueOnce(res({ command: { kind: "activate_mode", mode_id: CHILL } }))
      .mockResolvedValue(res({ command: null }));

    const seen: RemoteCommand[] = [];
    const stop = startRemoteControl((c) => seen.push(c), 10_000);

    await vi.waitFor(() => expect(seen).toHaveLength(1));
    expect(seen[0]).toEqual({ kind: "activate_mode", mode_id: CHILL });
    const urls = fetchMock.mock.calls.map(([url]) => String(url));
    expect(urls.every((url) => url.endsWith("/api/direct/commands/next"))).toBe(true);
    stop();
  });

  it("drops malformed commands", async () => {
    localStorage.setItem("nexum.direct.enabled", "true");
    fetchMock
      .mockResolvedValueOnce(res({ command: { kind: "delete_everything", mode_id: CHILL } }))
      .mockResolvedValue(res({ command: null }));
    const seen: RemoteCommand[] = [];
    const stop = startRemoteControl((c) => seen.push(c), 10_000);
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalled());
    await new Promise((r) => setTimeout(r, 30));
    expect(seen).toHaveLength(0);
    stop();
  });

  it("delivers a queued command, then drains until the queue is empty", async () => {
    localStorage.setItem("nexum.cloud.refresh", "r");
    localStorage.setItem("nexum.cloud.user", "u");
    fetchMock
      .mockResolvedValueOnce(res(session))
      .mockResolvedValueOnce(res({ command: { kind: "activate_mode", mode_id: GAMING } }))
      .mockResolvedValue(res({ command: null }));

    const seen: RemoteCommand[] = [];
    const stop = startRemoteControl((c) => seen.push(c), 10_000);

    await vi.waitFor(() => expect(seen).toHaveLength(1));
    expect(seen[0]).toEqual({ kind: "activate_mode", mode_id: GAMING });
    stop();
  });

  it("stops polling after stop() is called", async () => {
    localStorage.setItem("nexum.cloud.refresh", "r");
    localStorage.setItem("nexum.cloud.user", "u");
    fetchMock
      .mockResolvedValueOnce(res(session))
      .mockResolvedValue(res({ command: null }));
    const stop = startRemoteControl(() => {}, 10_000);
    await vi.waitFor(() => expect(fetchMock.mock.calls.length).toBeGreaterThan(1));
    const callsAfterStop = fetchMock.mock.calls.length;
    stop();
    await new Promise((r) => setTimeout(r, 50));
    // No further polls were scheduled/fired.
    expect(fetchMock.mock.calls.length).toBe(callsAfterStop);
  });
});

describe("isRemoteCommand", () => {
  it("accepts only activate_mode with a UUID", () => {
    expect(isRemoteCommand({ kind: "activate_mode", mode_id: CHILL })).toBe(true);
    expect(isRemoteCommand({ kind: "activate_mode", mode_id: "chill" })).toBe(false);
    expect(isRemoteCommand({ kind: "activate_mode", mode_id: 42 })).toBe(false);
    expect(isRemoteCommand({ kind: "other", mode_id: CHILL })).toBe(false);
    expect(isRemoteCommand(null)).toBe(false);
    expect(isRemoteCommand("activate_mode")).toBe(false);
  });
});

describe("direct mode publishing", () => {
  it("publishes nothing while disabled, and withdraws the modes when turned off", async () => {
    fetchMock.mockResolvedValue(res(null));
    await syncDirectModes([{ id: CHILL }]);
    expect(fetchMock).not.toHaveBeenCalled();

    await setDirectEnabled(true);
    await syncDirectModes([{ id: CHILL }]);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    await setDirectEnabled(false);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[1][1]).toMatchObject({ method: "PUT", body: "[]" });
  });

  it("publishes nothing while signed in", async () => {
    localStorage.setItem("nexum.direct.enabled", "true");
    localStorage.setItem("nexum.cloud.user", "u");
    localStorage.setItem("nexum.cloud.refresh", "r");
    fetchMock.mockResolvedValueOnce(res(session)).mockResolvedValue(res(null));
    await (await import("./sync")).loadSession();
    fetchMock.mockClear();
    await syncDirectModes([{ id: CHILL }]);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { startRemoteControl, type RemoteCommand } from "./remote";
import { clearSession } from "./sync";

function res(body: unknown) {
  return { ok: true, status: 200, json: async () => body } as unknown as Response;
}

const session = { token: "access", refresh_token: "next", user_id: "u" };

const fetchMock = vi.fn();

beforeEach(async () => {
  await clearSession();
  localStorage.clear();
  vi.stubGlobal("fetch", fetchMock);
  fetchMock.mockReset();
});
afterEach(() => vi.unstubAllGlobals());

describe("startRemoteControl", () => {
  it("does not poll while signed out", async () => {
    const stop = startRemoteControl(() => {}, 10_000);
    await new Promise((r) => setTimeout(r, 0));
    expect(fetchMock).not.toHaveBeenCalled();
    stop();
  });

  it("delivers a queued command, then drains until the queue is empty", async () => {
    localStorage.setItem("nexum.cloud.refresh", "r");
    localStorage.setItem("nexum.cloud.user", "u");
    fetchMock
      .mockResolvedValueOnce(res(session))
      .mockResolvedValueOnce(res({ command: { kind: "activate_mode", mode_id: "gaming" } }))
      .mockResolvedValue(res({ command: null }));

    const seen: RemoteCommand[] = [];
    const stop = startRemoteControl((c) => seen.push(c), 10_000);

    await vi.waitFor(() => expect(seen).toHaveLength(1));
    expect(seen[0]).toEqual({ kind: "activate_mode", mode_id: "gaming" });
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

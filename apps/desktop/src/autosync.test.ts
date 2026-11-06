import { beforeEach, describe, expect, it, vi } from "vitest";
import { syncOnce, type LocalModes } from "./autosync";
import { clearSession } from "./sync";
import type { Mode } from "./types";

// ---- A fake server with the same rules as services/nexum-cloud ---------------

type Row = { revision: number; mode: Mode };

class FakeCloud {
  rows: Row[] = [];
  private last = 0;
  requests = 0;

  sync(changes: { id: string; base_revision: number; mode: Mode | null }[]) {
    this.requests++;
    const conflicts: string[] = [];
    for (const change of changes) {
      const row = this.rows.find((r) => r.mode.id === change.id);
      const current = row?.revision ?? 0;
      if (!change.mode && !row) continue;
      if (current !== change.base_revision) {
        conflicts.push(change.id);
      } else if (!change.mode) {
        this.rows = this.rows.filter((r) => r !== row);
      } else if (row) {
        row.mode = structuredClone(change.mode);
        row.revision = ++this.last;
      } else {
        this.rows.push({ revision: ++this.last, mode: structuredClone(change.mode) });
      }
    }
    return { modes: structuredClone(this.rows), conflicts };
  }

  names() {
    return this.rows.map((r) => r.mode.name).sort();
  }
}

// ---- A machine: its local modes and its own remembered sync state ------------

class Machine implements LocalModes {
  modes = new Map<string, Mode>();
  private state: string | null = null;
  private ids = 0;
  beforeSecondRead: (() => void) | null = null;
  private reads = 0;

  constructor(private name: string) {}

  list = async () => {
    if (++this.reads === 2) this.beforeSecondRead?.();
    return [...this.modes.values()].map((m) => structuredClone(m));
  };
  save = async (mode: Mode) => void this.modes.set(mode.id, structuredClone(mode));
  remove = async (id: string) => void this.modes.delete(id);
  newId = async () => `${this.name}-copy-${++this.ids}`;

  add(id: string, name: string) {
    this.modes.set(id, mode(id, name));
  }
  rename(id: string, name: string) {
    this.modes.get(id)!.name = name;
  }
  names() {
    return [...this.modes.values()].map((m) => m.name).sort();
  }

  /** Runs with this machine's sync state in localStorage, as if on its own disk. */
  async sync() {
    this.reads = 0;
    if (this.state) localStorage.setItem("nexum.cloud.syncBase", this.state);
    else localStorage.removeItem("nexum.cloud.syncBase");
    const summary = await syncOnce(this);
    this.state = localStorage.getItem("nexum.cloud.syncBase");
    return summary;
  }
}

function mode(id: string, name: string): Mode {
  return { id, name, description: null, category: "custom", steps: [] } as unknown as Mode;
}

let cloudServer: FakeCloud;
let a: Machine;
let b: Machine;

beforeEach(async () => {
  await clearSession();
  localStorage.clear();
  localStorage.setItem("nexum.cloud.refresh", "r");
  localStorage.setItem("nexum.cloud.user", "user");
  cloudServer = new FakeCloud();
  a = new Machine("a");
  b = new Machine("b");
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string, init: RequestInit) => {
      if (url.endsWith("/refresh")) {
        return json({ token: "t", refresh_token: "r", user_id: "user" });
      }
      return json(cloudServer.sync(JSON.parse(init.body as string).changes));
    }),
  );
});

function json(body: unknown) {
  return { ok: true, status: 200, json: async () => body } as unknown as Response;
}

describe("syncOnce", () => {
  it("brings a new mode from one machine to the other", async () => {
    a.add("1", "Gaming");
    await a.sync();
    expect(cloudServer.names()).toEqual(["Gaming"]);
    const summary = await b.sync();
    expect(b.names()).toEqual(["Gaming"]);
    expect(summary).toEqual({ changed: true, conflicts: [] });
  });

  it("does nothing when nothing changed", async () => {
    a.add("1", "Gaming");
    await a.sync();
    const revision = cloudServer.rows[0].revision;
    expect(await a.sync()).toEqual({ changed: false, conflicts: [] });
    expect(cloudServer.rows[0].revision).toBe(revision);
  });

  it("carries edits and deletions across, on separate modes without conflict", async () => {
    a.add("1", "Gaming");
    a.add("2", "Work");
    a.add("3", "Chill");
    await a.sync();
    await b.sync();

    a.rename("1", "Gaming v2"); // A edits one, B edits another: both must survive
    b.rename("2", "Work v2");
    b.modes.delete("3");
    await a.sync();
    const summary = await b.sync();
    await a.sync();

    expect(summary.conflicts).toEqual([]);
    expect(a.names()).toEqual(["Gaming v2", "Work v2"]);
    expect(b.names()).toEqual(["Gaming v2", "Work v2"]);
    expect(cloudServer.names()).toEqual(["Gaming v2", "Work v2"]);
  });

  it("loses nothing when the same mode is edited on two machines", async () => {
    a.add("1", "Gaming");
    await a.sync();
    await b.sync();

    a.rename("1", "From A");
    b.rename("1", "From B");
    await a.sync();
    const summary = await b.sync();
    await a.sync();

    expect(summary.conflicts).toEqual(["From B"]);
    const both = ["From A", "From B (conflit)"];
    expect(a.names()).toEqual(both);
    expect(b.names()).toEqual(both);
    expect(cloudServer.names()).toEqual(both);
  });

  it("settles after a conflict", async () => {
    a.add("1", "Gaming");
    await a.sync();
    await b.sync();
    a.rename("1", "From A");
    b.rename("1", "From B");
    await a.sync();
    await b.sync();
    await a.sync();
    const revisions = cloudServer.rows.map((r) => r.revision);
    expect(await a.sync()).toEqual({ changed: false, conflicts: [] });
    expect(await b.sync()).toEqual({ changed: false, conflicts: [] });
    expect(cloudServer.rows.map((r) => r.revision)).toEqual(revisions);
  });

  it("does not report a conflict when both machines made the same mode", async () => {
    a.add("demo", "Gaming");
    b.add("demo", "Gaming");
    await a.sync();
    expect(await b.sync()).toEqual({ changed: false, conflicts: [] });
    expect(b.names()).toEqual(["Gaming"]);
  });

  it("keeps an edit when the mode was deleted elsewhere", async () => {
    a.add("1", "Gaming");
    await a.sync();
    await b.sync();
    a.modes.delete("1");
    b.rename("1", "Still wanted");
    await a.sync();
    await b.sync();
    await a.sync();
    expect(cloudServer.names()).toEqual(["Still wanted"]);
    expect(a.names()).toEqual(["Still wanted"]);
    expect(b.names()).toEqual(["Still wanted"]);
  });

  it("brings a mode back when it was deleted here but edited elsewhere", async () => {
    a.add("1", "Gaming");
    await a.sync();
    await b.sync();
    a.rename("1", "Edited");
    b.modes.delete("1");
    await a.sync();
    await b.sync();
    expect(b.names()).toEqual(["Edited"]);
    expect(cloudServer.names()).toEqual(["Edited"]);
  });

  it("does not overwrite an edit made while the sync is running", async () => {
    a.add("1", "Gaming");
    await a.sync();
    await b.sync();
    b.rename("1", "From B");
    await b.sync();

    a.beforeSecondRead = () => a.rename("1", "Typed during sync");
    await a.sync();
    a.beforeSecondRead = null;
    expect(a.names()).toEqual(["Typed during sync"]);
  });

  it("does not mistake a new mode edited during its first sync for a conflict", async () => {
    a.add("1", "Gaming");
    a.beforeSecondRead = () => a.rename("1", "Renamed during sync");
    const first = await a.sync();
    a.beforeSecondRead = null;
    const second = await a.sync();
    expect(first.conflicts).toEqual([]);
    expect(second.conflicts).toEqual([]);
    expect(a.names()).toEqual(["Renamed during sync"]);
    expect(cloudServer.names()).toEqual(["Renamed during sync"]);
  });

  it("does not resend a mode this machine stores differently from the server", async () => {
    const stored = { ...mode("1", "Gaming"), added_by_this_build: true } as unknown as Mode;
    const realSave = a.save;
    a.save = async (m) => realSave({ ...m, ...stored, name: m.name });
    cloudServer.sync([{ id: "1", base_revision: 0, mode: mode("1", "Gaming") }]);
    await a.sync();
    const revision = cloudServer.rows[0].revision;
    await a.sync();
    expect(cloudServer.rows[0].revision).toBe(revision);
  });

  it("forgets the sync state when another account signs in", async () => {
    a.add("1", "Gaming");
    await a.sync();
    localStorage.setItem("nexum.cloud.user", "someone-else");
    const other = new FakeCloud();
    cloudServer = other;
    await a.sync();
    expect(other.names()).toEqual(["Gaming"]); // sent as new, not deleted or conflicting
  });

  it("leaves everything in place when the cloud can't be reached", async () => {
    a.add("1", "Gaming");
    await a.sync();
    a.rename("1", "Edited offline");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));
    await expect(a.sync()).rejects.toThrow();
    expect(a.names()).toEqual(["Edited offline"]);
  });
});

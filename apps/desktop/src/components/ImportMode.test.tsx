import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, expect, test, vi } from "vitest";
import type { ImportPreview, RiskLevel } from "../types";
import ImportMode from "./ImportMode";

const api = vi.hoisted(() => ({
  previewImport: vi.fn(),
  importMode: vi.fn(),
}));
vi.mock("../api", () => ({ api }));
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
const host = document.createElement("div");
document.body.append(host);
let root: ReturnType<typeof createRoot>;
afterEach(async () => {
  await act(async () => root.unmount());
  vi.clearAllMocks();
});

function preview(level: RiskLevel, unknown_actions: string[] = []): ImportPreview {
  return {
    mode: { id: "new-id", name: "Chantier", description: null, category: "work", steps: [] },
    risk: { score: 0, level, issues: [], unknown_actions },
  };
}

async function render(onImported = vi.fn()) {
  root = createRoot(host);
  await act(async () => root.render(<ImportMode onImported={onImported} />));
  return onImported;
}

async function pickFile(contents: string) {
  const input = host.querySelector<HTMLInputElement>('input[type="file"]')!;
  // jsdom's File lacks .text(); the component only needs that method.
  const file = { name: "chantier.nexum.json", text: async () => contents };
  Object.defineProperty(input, "files", { configurable: true, value: [file] });
  await act(async () => input.dispatchEvent(new Event("change", { bubbles: true })));
}

const button = (label: string) =>
  [...host.querySelectorAll("button")].find(b => b.textContent === label)!;

test("shows the risk level, then imports the file on confirmation", async () => {
  api.previewImport.mockResolvedValue(preview("medium"));
  api.importMode.mockResolvedValue(preview("medium").mode);
  const onImported = await render();

  await pickFile('{"nexum_format":1}');
  expect(api.previewImport).toHaveBeenCalledWith('{"nexum_format":1}');
  expect(host.querySelector(".risk-badge")!.textContent).toBe("MEDIUM");
  expect(api.importMode).not.toHaveBeenCalled();

  await act(async () => button("Importer").click());
  expect(api.importMode).toHaveBeenCalledWith('{"nexum_format":1}');
  expect(onImported).toHaveBeenCalledOnce();
  expect(host.querySelector('[role="status"]')!.textContent).toContain("Chantier");
  expect(host.querySelector(".risk-badge")).toBeNull();
});

test("refuses to import a mode with unknown actions", async () => {
  api.previewImport.mockResolvedValue(preview("rejected", ["evil.rm_rf"]));
  await render();

  await pickFile("{}");
  expect(host.textContent).toContain("Actions inconnues : evil.rm_rf");
  expect(button("Importer").disabled).toBe(true);
});

test("asks for explicit consent on high-risk modes", async () => {
  api.previewImport.mockResolvedValue(preview("high"));
  await render();

  await pickFile("{}");
  expect(button("Importer malgré le risque").disabled).toBe(false);
});

test("reports an invalid file without offering to import it", async () => {
  api.previewImport.mockRejectedValue("fichier invalide : expected value at line 1 column 1");
  await render();

  await pickFile("not json");
  expect(host.querySelector('[role="alert"]')!.textContent).toContain("fichier invalide");
  expect(host.querySelector(".risk-badge")).toBeNull();
});

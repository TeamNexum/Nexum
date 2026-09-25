import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, expect, test, vi } from "vitest";
import WindowBar from "./WindowBar";

const native = vi.hoisted(() => ({
  isMaximized: vi.fn(async () => false),
  onResized: vi.fn(async (_handler: () => void) => () => {}),
  minimize: vi.fn(async () => {}),
  toggleMaximize: vi.fn(async () => {}),
  close: vi.fn(async () => {}),
  startDragging: vi.fn(async () => {}),
}));
vi.mock("../api", () => ({ IS_DESKTOP: true }));
vi.mock("@tauri-apps/api/window", () => ({ getCurrentWindow: () => native }));
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
const host = document.createElement("div");
document.body.append(host);
let root: ReturnType<typeof createRoot>;
afterEach(async () => {
  await act(async () => root.unmount());
  vi.clearAllMocks();
});

test("routes window controls, dragging and restore state to the native API", async () => {
  root = createRoot(host);
  await act(async () => root.render(<WindowBar />));
  const click = async (label: string) => {
    await act(async () => host.querySelector<HTMLButtonElement>(`[aria-label="${label}"]`)!.click());
  };
  await click("Réduire la fenêtre");
  await click("Agrandir la fenêtre");
  await click("Fermer la fenêtre");
  expect(native.minimize).toHaveBeenCalledOnce();
  expect(native.toggleMaximize).toHaveBeenCalledOnce();
  expect(native.close).toHaveBeenCalledOnce();
  await act(async () => {
    host.querySelector('.window-drag-area')!.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, button: 0, detail: 1 }));
  });
  expect(native.startDragging).toHaveBeenCalledOnce();
  native.isMaximized.mockResolvedValue(true);
  await act(async () => native.onResized.mock.calls[0][0]());
  expect(host.querySelector('[aria-label="Restaurer la fenêtre"]')).not.toBeNull();
});

test("shows a recoverable error when a native command fails", async () => {
  native.close.mockRejectedValueOnce(new Error("denied"));
  root = createRoot(host);
  await act(async () => root.render(<WindowBar />));
  await act(async () => host.querySelector<HTMLButtonElement>('[aria-label="Fermer la fenêtre"]')!.click());
  expect(host.querySelector('[role="alert"]')?.textContent).toContain("Réessayez");
});

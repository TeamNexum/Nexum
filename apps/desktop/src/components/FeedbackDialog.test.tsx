import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeAll, expect, test, vi } from "vitest";
import FeedbackDialog from "./FeedbackDialog";

const api = vi.hoisted(() => ({
  feedbackContext: vi.fn(async (includeLogs: boolean) => ({
    version: "0.1.0",
    os: "linux (x86_64)",
    logs: includeLogs ? "INFO mode 'Gaming' started" : null,
  })),
}));
const cloud = vi.hoisted(() => ({ sendFeedback: vi.fn(async () => {}) }));

vi.mock("../api", () => ({ api }));
vi.mock("../sync", () => ({ cloud }));
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
const host = document.createElement("div");
document.body.append(host);
let root: ReturnType<typeof createRoot>;

beforeAll(() => {
  // jsdom has no modal dialogs.
  HTMLDialogElement.prototype.showModal ??= function (this: HTMLDialogElement) { this.open = true; };
  HTMLDialogElement.prototype.close ??= function (this: HTMLDialogElement) { this.open = false; };
});
afterEach(async () => {
  await act(async () => root.unmount());
  vi.clearAllMocks();
});

async function render() {
  root = createRoot(host);
  await act(async () => root.render(<FeedbackDialog onClose={vi.fn()} />));
}

async function type(selector: string, value: string) {
  const el = host.querySelector<HTMLTextAreaElement | HTMLInputElement>(selector)!;
  const setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), "value")!.set!;
  await act(async () => {
    setter.call(el, value);
    el.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

const submitButton = () => host.querySelector<HTMLButtonElement>('button[type="submit"]')!;

test("sends only the message unless the tester opts in", async () => {
  await render();
  expect(submitButton().disabled).toBe(true);
  expect(host.querySelector<HTMLInputElement>('input[type="checkbox"]')!.checked).toBe(false);

  await type("textarea", "  Steam ne se lance pas  ");
  await act(async () => submitButton().click());

  expect(cloud.sendFeedback).toHaveBeenCalledWith({
    message: "Steam ne se lance pas",
    contact: null,
    version: "0.1.0",
    os: "linux (x86_64)",
    screenshot: null,
    logs: null,
  });
  expect(api.feedbackContext).not.toHaveBeenCalledWith(true);
  expect(host.textContent).toContain("Merci");
});

test("attaches logs after consent and keeps the form when sending fails", async () => {
  cloud.sendFeedback.mockRejectedValueOnce(new Error("Impossible de joindre le cloud"));
  await render();
  await type("textarea", "Bug");
  await type('input:not([type])', "sam#1234");
  await act(async () => host.querySelector<HTMLInputElement>('input[type="checkbox"]')!.click());

  const details = host.querySelector("details")!;
  await act(async () => {
    details.open = true;
    details.dispatchEvent(new Event("toggle"));
  });
  expect(host.querySelector(".feedback-logs")!.textContent).toContain("mode 'Gaming' started");

  await act(async () => submitButton().click());
  expect(cloud.sendFeedback).toHaveBeenCalledWith(
    expect.objectContaining({ contact: "sam#1234", logs: "INFO mode 'Gaming' started" }),
  );
  expect(host.querySelector('[role="alert"]')!.textContent).toBe("Impossible de joindre le cloud");
  expect(host.querySelector("textarea")!.value).toBe("Bug");
});

import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeAll, expect, test, vi } from "vitest";
import FeedbackDialog from "./FeedbackDialog";

const api = vi.hoisted(() => ({
  feedbackLogs: vi.fn(async () => "INFO mode 'Gaming' started"),
  sendFeedback: vi.fn(async () => {}),
}));

vi.mock("../api", () => ({ api }));
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

  expect(api.sendFeedback).toHaveBeenCalledWith({
    message: "Steam ne se lance pas",
    contact: null,
    screenshot: null,
    include_logs: false,
  });
  expect(api.feedbackLogs).not.toHaveBeenCalled();
  expect(host.textContent).toContain("Merci");
});

test("attaches logs after consent and keeps the form when sending fails", async () => {
  api.sendFeedback.mockRejectedValueOnce(new Error("Envoi impossible"));
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
  expect(api.sendFeedback).toHaveBeenCalledWith(expect.objectContaining({ contact: "sam#1234", include_logs: true }));
  expect(host.querySelector('[role="alert"]')!.textContent).toBe("Envoi impossible");
  expect(host.querySelector("textarea")!.value).toBe("Bug");
});

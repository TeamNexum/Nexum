import { expect, test, type Page } from "@playwright/test";

async function mockDesktop(page: Page) {
  await page.addInitScript(() => {
    const modes = ["Alpha", "Beta", "Gamma"].map((name, i) => ({
      id: String(i), name, category: "work", description: "Profil de test",
      steps: [
        { order: 2, type: "display.set_brightness", params: { percent: 70 }, enabled: false, on_error: "continue" },
        { order: 1, type: "audio.set_volume", params: { percent: 40 }, enabled: true, on_error: "continue" },
      ],
    }));
    const calls: string[] = [];
    Object.assign(window, {
      __testCalls: calls,
      __TAURI_INTERNALS__: {
        metadata: { currentWindow: { label: "main" }, currentWebview: { label: "main" } },
        transformCallback: () => 1, unregisterCallback: () => {},
        invoke: async (command: string) => {
          calls.push(command);
          if (command === "get_modes") return modes;
          if (command === "action_catalog") return ["audio.set_volume", "display.set_brightness"];
          if (command === "activate_mode") return { success: true, steps: [{ success: true }] };
          if (command === "check_connections") return [
            { id: "audio", available: true, detail: "Sortie audio accessible" },
            { id: "display", available: false, detail: "Aucun écran contrôlable" },
            { id: "hue", available: false, detail: "Pont non configuré" },
          ];
          if (command === "plugin:window|is_maximized") return false;
          if (command === "plugin:event|listen") return 1;
          return null;
        },
      },
    });
  });
}

test("previews ordered actions without executing, restores focus and opens the correct editor", async ({ page }) => {
  await mockDesktop(page);
  await page.goto("/");
  const opener = page.getByRole("button", { name: "Voir le profil Alpha", exact: true });
  await opener.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.locator(".profile-action-preview li").first()).toContainText("Volume fixé à 40%");
  await expect(dialog.locator(".profile-action-preview li").last()).toContainText("Désactivée");
  expect(await page.evaluate(() => (window as any).__testCalls.includes("activate_mode"))).toBe(false);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(opener).toBeFocused();
  await opener.click();
  await dialog.getByRole("button", { name: "Activer ce profil" }).click();
  await expect(dialog.getByRole("status")).toContainText("Profil activé");
  await dialog.getByRole("button", { name: "Modifier dans le Studio" }).click();
  await expect(page.locator(".editor-sheet input").first()).toHaveValue("Alpha");
});

test("activates directly and supports global search, diagnostics and persistent density", async ({ page }) => {
  await mockDesktop(page);
  await page.route("**/health", route => route.fulfill({ json: { status: "ok", service: "nexum-cloud" } }));
  await page.goto("/");
  await page.getByRole("button", { name: "Activer directement Alpha", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  expect(await page.evaluate(() => (window as any).__testCalls.filter((c: string) => c === "activate_mode").length)).toBe(1);
  await page.keyboard.press("Control+k");
  await page.getByRole("textbox", { name: "Rechercher une page ou un profil" }).fill("Modifier Beta");
  await page.keyboard.press("Enter");
  await expect(page.locator(".editor-sheet input").first()).toHaveValue("Beta");
  await page.keyboard.press("Control+k");
  await page.getByRole("textbox", { name: "Rechercher une page ou un profil" }).fill("Modifier Gamma");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(page.locator(".editor-sheet input").first()).toHaveValue("Gamma");
  await page.getByRole("navigation").getByRole("button", { name: "Système", exact: true }).click();
  await page.getByRole("button", { name: "Compact", exact: true }).click();
  await expect(page.locator(".app")).toHaveAttribute("data-density", "compact");
  await page.getByRole("button", { name: "Vérifier", exact: true }).click();
  await expect(page.locator(".connection-list li").first()).toContainText("Disponible");
  await expect(page.locator(".connection-list li").nth(1)).toContainText("Non confirmé");
  await expect(page.locator(".connection-list li").last()).toContainText("Disponible");
  await page.reload();
  await expect(page.locator(".app")).toHaveAttribute("data-density", "compact");
});

test("persists favorites and keyboard ordering, and fits the drawer in a narrow window", async ({ page }) => {
  await mockDesktop(page);
  await page.goto("/");
  await page.getByRole("button", { name: "Ajouter Gamma aux favoris", exact: true }).click();
  await page.getByRole("button", { name: "Ajouter Beta aux favoris", exact: true }).click();
  await page.getByRole("button", { name: "Voir le profil Gamma", exact: true }).click();
  await page.getByRole("button", { name: "Déplacer le profil avant" }).click();
  await page.keyboard.press("Escape");
  await expect(page.locator(".saved-profile").first()).toHaveAttribute("data-mode-id", "2");
  await page.reload();
  await expect(page.locator(".saved-profile").first()).toHaveAttribute("data-mode-id", "2");
  await expect(page.getByRole("button", { name: "Retirer Gamma des favoris" })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Réorganiser Gamma", exact: true }).dragTo(page.locator('.saved-profile[data-mode-id="1"]'));
  await expect(page.locator(".saved-profile").first()).toHaveAttribute("data-mode-id", "1");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Voir le profil Gamma", exact: true }).click();
  const box = await page.getByRole("dialog").boundingBox();
  expect(box!.width).toBeLessThanOrEqual(390);
  await expect(page.getByRole("button", { name: "Activer ce profil" })).toBeInViewport();
});

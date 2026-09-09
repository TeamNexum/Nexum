import { expect, test } from "@playwright/test";

test.describe("Nexum desktop UI (browser preview)", () => {
  test("renders the shell, tabs, and the browser-guard banner", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".logo")).toHaveText(/NEXUM/);

    for (const label of ["Dashboard", "Mode Editor", "Automations", "Marketplace", "Account & Sync"]) {
      await expect(page.getByRole("button", { name: new RegExp(label) })).toBeVisible();
    }

    // Outside the Tauri webview, the app shows a preview notice instead of crashing.
    await expect(page.getByText(/Aperçu navigateur/)).toBeVisible();
  });

  test("navigates to the Account & Sync tab and shows the sign-in form", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Account & Sync/ }).click();
    await expect(page.getByText(/Compte & synchronisation/i)).toBeVisible();
    await expect(page.getByLabel("E-mail")).toBeVisible();
    await expect(page.getByLabel("Mot de passe")).toBeVisible();
  });

  test("signs in against a mocked cloud and shows the connected state", async ({ page }) => {
    await page.route("**/api/auth/register", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ token: "e2e-token" }),
      }),
    );

    await page.goto("/");
    await page.getByRole("button", { name: /Account & Sync/ }).click();
    await page.getByLabel("E-mail").fill("demo@nexum.app");
    await page.getByLabel("Mot de passe").fill("password");
    await page.getByRole("button", { name: "Créer un compte" }).click();

    await expect(page.getByText("✓ Connecté")).toBeVisible();
  });
});

import { expect, test } from "@playwright/test";

test.describe("Nexum desktop UI (browser preview)", () => {
  test("renders the shell, tabs, and the browser-guard banner", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".brand-name")).toHaveText(/NEXUM/);

    for (const label of ["Accueil", "Studio", "Règles", "Découvrir", "Système"]) {
      await expect(page.getByRole("navigation").getByRole("button", { name: label, exact: true })).toBeVisible();
    }

    // Outside the Tauri webview, the app shows a preview status instead of crashing.
    await expect(page.getByText(/Aperçu Web/)).toBeVisible();
  });

  test("navigates to settings and shows the sign-in form", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Système/ }).click();
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
    await page.getByRole("button", { name: /Système/ }).click();
    await page.getByLabel("E-mail").fill("demo@nexum.app");
    await page.getByLabel("Mot de passe").fill("password");
    await page.getByRole("button", { name: "Créer un compte" }).click();

    await expect(page.getByText("✓ Connecté")).toBeVisible();
  });

  test("moves the home carousel with its visible controls", async ({ page }) => {
    await page.setViewportSize({ width: 900, height: 800 });
    await page.goto("/");
    const carousel = page.locator(".cinematic-carousel");
    await expect(page.getByRole("button", { name: "Profils suivants" })).toBeEnabled();
    await page.getByRole("button", { name: "Profils suivants" }).click();
    await expect.poll(() => carousel.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0);
    await page.getByRole("button", { name: "Profils précédents" }).click();
    await expect.poll(() => carousel.evaluate((el) => el.scrollLeft)).toBe(0);
    await carousel.hover();
    await page.mouse.wheel(0, 350);
    await expect.poll(() => carousel.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0);
  });

  for (const width of [390, 900]) {
    test(`reaches both ends of the profile shelf at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      await page.goto("/");
      const carousel = page.locator(".cinematic-carousel");
      await carousel.hover();
      for (let i = 0; i < 20; i++) await page.mouse.wheel(0, 100);
      await expect.poll(() => carousel.evaluate(el =>
        el.scrollWidth - el.clientWidth - el.scrollLeft,
      )).toBeLessThanOrEqual(1);
      await expect(page.getByRole("button", { name: "Profils suivants" })).toBeDisabled();
      const shelf = await carousel.boundingBox();
      const last = await carousel.locator(".cine-card").last().boundingBox();
      expect(last!.x + last!.width).toBeLessThanOrEqual(shelf!.x + shelf!.width);
      await page.mouse.wheel(0, -10000);
      await expect.poll(() => carousel.evaluate(el => el.scrollLeft)).toBe(0);
      await expect(page.getByRole("button", { name: "Profils précédents" })).toBeDisabled();
    });
  }

  test("keeps every section within a narrow window", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    for (const label of ["Accueil", "Studio", "Règles", "Découvrir", "Système"]) {
      await page.getByRole("button", { name: label, exact: true }).click();
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    }
  });

  test("shows a neutral activity list without duplicate subscriptions", async ({ page }) => {
    await page.route("**/src/api.ts*", route => route.fulfill({
      contentType: "application/javascript",
      body: `
        export const IS_DESKTOP = false;
        export const api = {};
        export function onEngineEvent(handler) {
          const timer = setTimeout(() => {
            handler({kind: 'mode_started', mode_id: 'test', name: 'Test'});
            handler({kind: 'step_started', action_type: 'gaming.launch_steam', order: 0});
            handler({kind: 'step_finished', action_type: 'gaming.launch_steam', order: 0, success: true, message: 'Steam ouvert'});
            handler({kind: 'step_started', action_type: 'display.set_brightness', order: 1});
            handler({kind: 'step_finished', action_type: 'display.set_brightness', order: 1, success: true});
            handler({kind: 'step_started', action_type: 'display.set_brightness', order: 2});
            handler({kind: 'step_finished', action_type: 'display.set_brightness', order: 2, success: true});
            handler({kind: 'mode_finished', mode_id: 'test', success: false});
          }, 50);
          return new Promise(resolve => setTimeout(() => resolve(() => clearTimeout(timer)), 100));
        }
      `,
    }));
    await page.goto("/");
    const rows = page.getByRole("list", { name: "Historique des actions" }).getByRole("listitem");
    await expect(rows).toHaveCount(3);
    await expect(page.getByText("Régler la luminosité", { exact: true })).toHaveCount(2);
    await expect(page.locator('.activity-row[data-status="running"]')).toHaveCount(0);
    await expect(page.getByText("Certaines actions ont échoué")).toBeVisible();
    await expect(page.getByText("Steam ouvert")).not.toBeVisible();
    await page.getByText("Détails", { exact: true }).click();
    await expect(page.getByText("Steam ouvert")).toBeVisible();
    await page.getByRole("navigation").getByRole("button", { name: "Système", exact: true }).click();
    await page.getByRole("navigation").getByRole("button", { name: "Accueil", exact: true }).click();
    await expect(page.locator(".activity-session")).toHaveCount(1);
    await expect(rows).toHaveCount(3);
    expect(await rows.first().evaluate(el => getComputedStyle(el).backgroundColor)).toBe("rgba(0, 0, 0, 0)");
    await page.getByRole("button", { name: "Effacer", exact: true }).click();
    await expect(page.getByText("Tout est calme pour le moment")).toBeVisible();
  });
});



import { test, expect } from "@playwright/test";

// These tests run WITHOUT auth state — they verify redirect protection
test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Protection des routes (middleware)", () => {
  const protectedRoutes = [
    "/",
    "/factures",
    "/factures/nouvelle",
    "/clients",
    "/services",
    "/stock",
    "/rendez-vous",
    "/charges",
    "/parametres",
  ];

  for (const route of protectedRoutes) {
    test(`redirige vers /landing depuis ${route} (non authentifié)`, async ({ page }) => {
      await page.goto(route);
      await expect(page).toHaveURL("/landing", { timeout: 5000 });
    });
  }

  test("la page /landing est accessible sans authentification", async ({ page }) => {
    await page.goto("/landing");
    await expect(page).toHaveURL("/landing");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("la page /connexion est accessible sans authentification", async ({ page }) => {
    await page.goto("/connexion");
    await expect(page).toHaveURL("/connexion");
    await expect(page.getByRole("heading", { name: "Connexion" })).toBeVisible();
  });
});

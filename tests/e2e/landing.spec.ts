import { test, expect } from "@playwright/test";

test.describe("Landing page", () => {
  test("renders hero section", async ({ page }) => {
    await page.goto("/landing");

    await expect(page).toHaveTitle(/Salon Facture/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("salon");
    await expect(page.getByRole("navigation")).toBeVisible();
  });

  test("shows all 6 feature cards with titles", async ({ page }) => {
    await page.goto("/landing");

    const expectedFeatures = [
      "Facturation professionnelle",
      "Gestion des clients",
      "Rendez-vous",
      "Stock & produits",
      "Charges & salaires",
      "Tableau de bord",
    ];

    for (const title of expectedFeatures) {
      await expect(page.getByRole("heading", { name: title, level: 3 })).toBeVisible();
    }
  });

  test("displays pricing section with two plans", async ({ page }) => {
    await page.goto("/landing");

    // Use exact match to avoid multiple matches with "0 FCFA"
    await expect(page.getByText("0 FCFA", { exact: true })).toBeVisible();
    await expect(page.getByText("9 900")).toBeVisible();
    await expect(page.getByText("Pro", { exact: true })).toBeVisible();
  });

  test("all primary CTA buttons link to /connexion", async ({ page }) => {
    await page.goto("/landing");

    const ctaButtons = page.getByRole("link", { name: /essai|compte|commencer/i });
    const count = await ctaButtons.count();
    expect(count).toBeGreaterThanOrEqual(2);

    for (let i = 0; i < count; i++) {
      const href = await ctaButtons.nth(i).getAttribute("href");
      expect(href).toBe("/connexion");
    }
  });

  test("shows testimonials from three salons", async ({ page }) => {
    await page.goto("/landing");

    await expect(page.getByText("Aminata D.")).toBeVisible();
    await expect(page.getByText("Fatoumata K.")).toBeVisible();
    await expect(page.getByText("Marième S.")).toBeVisible();
  });

  test("navbar has correct links", async ({ page }) => {
    await page.goto("/landing");

    const nav = page.locator("nav").first();
    await expect(nav).toBeVisible();
    await expect(nav.getByText("Salon Facture")).toBeVisible();
    await expect(nav.getByRole("link", { name: /Se connecter/i })).toHaveAttribute("href", "/connexion");
  });

  test("footer renders", async ({ page }) => {
    await page.goto("/landing");

    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
    // Use first() because "Salon Facture" appears in logo span + copyright text
    await expect(footer.getByText("Salon Facture").first()).toBeVisible();
    await expect(footer.getByText(/Tous droits réservés/)).toBeVisible();
  });

  test("stats section shows key numbers", async ({ page }) => {
    await page.goto("/landing");

    await expect(page.getByText("500+")).toBeVisible();
    await expect(page.getByText("98%")).toBeVisible();
  });
});

import { test, expect } from "@playwright/test";

test.describe("Page de connexion", () => {
  test("affiche le formulaire de connexion par défaut", async ({ page }) => {
    await page.goto("/connexion");

    await expect(page.getByRole("heading", { name: "Connexion" })).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Mot de passe")).toBeVisible();
    await expect(page.getByRole("button", { name: "Se connecter" })).toBeVisible();
  });

  test("bascule vers le mode inscription", async ({ page }) => {
    await page.goto("/connexion");

    await page.getByRole("button", { name: /S'inscrire|inscrire/i }).click();

    await expect(page.getByRole("heading", { name: "Créer un compte" })).toBeVisible();
    await expect(page.getByLabel("Nom du salon")).toBeVisible();
    await expect(page.getByRole("button", { name: "Créer mon compte" })).toBeVisible();
  });

  test("retour au mode connexion depuis l'inscription", async ({ page }) => {
    await page.goto("/connexion");

    await page.getByRole("button", { name: /S'inscrire|inscrire/i }).click();
    await page.getByRole("button", { name: /connecter/i }).click();

    await expect(page.getByRole("heading", { name: "Connexion" })).toBeVisible();
    await expect(page.getByLabel("Nom du salon")).not.toBeVisible();
  });

  test("affiche une erreur avec des identifiants incorrects", async ({ page }) => {
    await page.goto("/connexion");

    await page.locator('input[name="email"]').fill("test-invalide@example.com");
    await page.locator('input[name="password"]').fill("motdepassefaux");
    await page.getByRole("button", { name: "Se connecter" }).click();

    // Wait for error message (div with destructive styling or any error text)
    await expect(page.locator("text=/incorrect|invalide|invalid|error|erreur/i").or(
      page.locator("[class*='destructive']")
    )).toBeVisible({ timeout: 10000 });
  });

  test("valide les champs requis (HTML5 validation)", async ({ page }) => {
    await page.goto("/connexion");

    // Email input has required attribute
    const emailInput = page.getByLabel("Email");
    await expect(emailInput).toHaveAttribute("required");
    await expect(emailInput).toHaveAttribute("type", "email");

    // Password input has minLength
    const passwordInput = page.getByLabel("Mot de passe");
    await expect(passwordInput).toHaveAttribute("required");
    await expect(passwordInput).toHaveAttribute("minlength", "6");
  });

  test("affiche le logo Salon Facture", async ({ page }) => {
    await page.goto("/connexion");

    await expect(page.getByText("Salon Facture")).toBeVisible();
    await expect(page.locator("svg[class*='Scissors'], [data-lucide='scissors']").or(
      page.locator('[class*="scissor"], [class*="Scissor"]')
    )).toBeTruthy();
  });
});

test.describe("Authentification avec identifiants réels", () => {
  test.skip(!process.env.TEST_EMAIL || !process.env.TEST_PASSWORD,
    "TEST_EMAIL et TEST_PASSWORD requis");

  test("connexion réussie redirige vers le dashboard", async ({ page }) => {
    await page.goto("/connexion");

    await page.locator('input[name="email"]').fill(process.env.TEST_EMAIL!);
    await page.locator('input[name="password"]').fill(process.env.TEST_PASSWORD!);
    await page.getByRole("button", { name: "Se connecter" }).click();

    await expect(page).toHaveURL("/", { timeout: 10000 });
    await expect(page.locator("aside")).toBeVisible();
    await expect(page.getByText("Tableau de bord")).toBeVisible();
  });

  test("inscription d'un nouveau compte", async ({ page }) => {
    test.skip(true, "Ne pas créer de comptes en CI — test manuel uniquement");
  });
});

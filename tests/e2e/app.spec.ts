import { test, expect } from "@playwright/test";

// All tests in this file use auth state saved by setup/auth.setup.ts
// They are skipped automatically if no credentials were provided

test.describe("Dashboard", () => {
  test("affiche le tableau de bord après connexion", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("aside")).toBeVisible();
    await expect(page.getByText("Tableau de bord")).toBeVisible();
    // Stat cards should be visible
    await expect(page.getByText("Total factures")).toBeVisible();
    await expect(page.getByText("Montant encaissé")).toBeVisible();
  });

  test("la sidebar affiche tous les liens de navigation", async ({ page }) => {
    await page.goto("/");

    const sidebar = page.locator("aside");
    for (const label of ["Factures", "Clients", "Services", "Stock", "Rendez-vous", "Charges", "Paramètres"]) {
      await expect(sidebar.getByText(label)).toBeVisible();
    }
  });
});

test.describe("Gestion des clients", () => {
  test("la page clients charge et affiche le tableau", async ({ page }) => {
    await page.goto("/clients");

    await expect(page.getByRole("heading", { name: /clients/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Ajouter|Nouveau/i })).toBeVisible();
  });

  test("ouvre le modal d'ajout de client", async ({ page }) => {
    await page.goto("/clients");

    await page.getByRole("button", { name: /Ajouter|Nouveau/i }).click();

    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByLabel("Nom *")).toBeVisible();
    await expect(page.getByLabel("Prénom *")).toBeVisible();
    await expect(page.getByLabel("Téléphone *")).toBeVisible();
  });

  test("ferme le modal avec Annuler", async ({ page }) => {
    await page.goto("/clients");

    await page.getByRole("button", { name: /Ajouter|Nouveau/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();

    await page.getByRole("button", { name: "Annuler" }).click();
    await expect(page.getByRole("dialog")).not.toBeVisible();
  });
});

test.describe("Gestion des factures", () => {
  test("la page factures charge correctement", async ({ page }) => {
    await page.goto("/factures");

    await expect(page.getByRole("button", { name: /Nouvelle facture/i })).toBeVisible();
  });

  test("la page nouvelle facture affiche le formulaire", async ({ page }) => {
    await page.goto("/factures/nouvelle");

    await expect(page.getByText("Nouvelle facture")).toBeVisible();
    await expect(page.getByText("Client")).toBeVisible();
    await expect(page.getByText("Date d'échéance")).toBeVisible();
    await expect(page.getByRole("button", { name: /Ajouter une ligne/i })).toBeVisible();
  });
});

test.describe("Gestion du stock", () => {
  test("la page stock se charge", async ({ page }) => {
    await page.goto("/stock");

    await expect(page.getByPlaceholder("Rechercher...")).toBeVisible();
    await expect(page.getByRole("button", { name: "Ajouter" })).toBeVisible();
  });
});

test.describe("Paramètres", () => {
  test("la page paramètres affiche le formulaire entreprise", async ({ page }) => {
    await page.goto("/parametres");

    await expect(page.getByText("Informations de l'entreprise")).toBeVisible();
    await expect(page.getByText("Informations légales")).toBeVisible();
    await expect(page.getByRole("button", { name: /Enregistrer/i })).toBeVisible();
  });
});

test.describe("Navigation", () => {
  test("navigation via la sidebar fonctionne", async ({ page }) => {
    await page.goto("/");

    await page.locator("aside").getByText("Clients").click();
    await expect(page).toHaveURL("/clients");

    await page.locator("aside").getByText("Factures").first().click();
    await expect(page).toHaveURL("/factures");
  });

  test("lien actif est mis en évidence dans la sidebar", async ({ page }) => {
    await page.goto("/clients");

    const activeLink = page.locator("aside a[href='/clients']");
    await expect(activeLink).toHaveClass(/bg-sidebar-primary|text-white/);
  });
});

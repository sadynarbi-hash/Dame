import { test as setup, expect } from "@playwright/test";
import path from "path";

const authFile = path.join(__dirname, "../../../playwright/.auth/user.json");

setup("authenticate", async ({ page }) => {
  const email = process.env.TEST_EMAIL;
  const password = process.env.TEST_PASSWORD;

  if (!email || !password) {
    // Save empty auth state so authenticated tests are skipped gracefully
    await page.context().storageState({ path: authFile });
    setup.skip(true, "TEST_EMAIL and TEST_PASSWORD not set — skipping auth setup");
    return;
  }

  await page.goto("/connexion");

  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Mot de passe").fill(password);
  await page.getByRole("button", { name: "Se connecter" }).click();

  // Wait for redirect to dashboard
  await expect(page).toHaveURL("/", { timeout: 10000 });
  await expect(page.locator("aside")).toBeVisible();

  await page.context().storageState({ path: authFile });
});

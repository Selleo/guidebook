import { test, expect } from "@playwright/test";

test("move to register page", async ({ page }) => {
  await page.goto("/auth/login");

  await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
});

test("get started link", async ({ page }) => {
  await page.goto("https://playwright.dev/");

  await page.getByRole("link", { name: "Get started" }).click();

  await expect(
    page.getByRole("heading", { name: "Installation" })
  ).toBeVisible();
});

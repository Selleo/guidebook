import { test, expect } from "@playwright/test";

test("move to register page", async ({ page }) => {
  await page.goto("/auth/login");

  await page.getByText("Sign up").click();

  await expect(page.getByRole("heading", { name: "Sign up" })).toBeVisible();
});

test("login as test user", async ({ page }) => {
  await page.goto("/auth/login");

  await page.getByLabel("email").fill("user@example.com");
  await page.getByLabel("password").fill("password");
  await page.getByRole("button", { name: /login/i }).click();

  await expect(page).toHaveURL(/dashboard/);
  await expect(page).toHaveTitle(/dashboard/i);
});

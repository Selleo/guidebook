import { test, expect } from "@playwright/test";

test("move to register page", async ({ page }) => {
  await page.goto("/auth/login");

  await page.getByText("Sign up").click();

  await expect(page.getByRole("heading", { name: "Sign up" })).toBeVisible();
});

test("login as test user", async ({ page }) => {
  await page.goto("/auth/login");

  await page.getByRole("link", { name: "Get started" }).click();

  await expect(
    page.getByRole("heading", { name: "Installation" })
  ).toBeVisible();
});

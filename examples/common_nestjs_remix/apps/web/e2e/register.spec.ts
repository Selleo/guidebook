import { test, expect } from "@playwright/test";

test("fail on invalid credentials", async ({ page }) => {
  await page.goto("/auth/register");

  await page.getByLabel("email").fill("user@example");
  await page.getByLabel("password").fill("pass");

  await page.getByRole("button", { name: /create/i }).click();

  await expect(page.getByText("Invalid email")).toBeVisible();
  await expect(
    page.getByText("Password must be at least 8 characters")
  ).toBeVisible();
});

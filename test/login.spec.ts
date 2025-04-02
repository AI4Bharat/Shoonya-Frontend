import { test, expect } from "@playwright/test";

const TEST_EMAIL = process.env.NEXT_PUBLIC_TEST_EMAIL;
const TEST_PASSWORD = process.env.NEXT_PUBLIC_TEST_PASSWORD;

test("Login flow", async ({ page }) => {
  await page.goto("http://localhost:3000/#/login");

  page.on("request", (request) => console.log("Request:", request.url()));
  page.on("response", (response) =>
    console.log("Response:", response.url(), response.status())
  );

  const loginResponse = page.waitForResponse(
    (response) =>
      response.request().method() === "POST" &&
      response.url().includes("/users/auth/jwt/create") &&
      response.status() === 200,
    { timeout: 60000 }
  );

  await page.fill('input[name="email"]', TEST_EMAIL);
  await page.fill('input[name="password"]', TEST_PASSWORD);

  await page.click('button[type="submit"]');

  const response = await loginResponse;
  const responseBody = await response.json();

  expect(responseBody.access).toBeDefined();

  await page.waitForLoadState("networkidle");

  await expect(page).toHaveURL(
    `http://localhost:3000/?email=${encodeURIComponent(
      TEST_EMAIL
    )}&password=${encodeURIComponent(TEST_PASSWORD)}#/projects`
  );
});

test("Forgot Password Flow", async ({ page }) => {
  await page.goto("http://localhost:3000/#/forgot-password");

  await page.fill("input", TEST_EMAIL);

  await page.click("button");

  await expect(page).toHaveURL("http://localhost:3000/#/login");
});

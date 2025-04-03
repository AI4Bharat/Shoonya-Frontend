import { test, expect } from "@playwright/test";

test("Login Test", async ({ page }) => {
  // Navigate to the login page
  await page.goto("http://localhost:3000/");
  console.log("EMAIL:", process.env.REACT_APP_TEST_EMAIL);
  console.log("PASSWORD:", process.env.REACT_APP_TEST_PASSWORD);

  // Wait for the login form to be visible
  await page.waitForSelector(".input-email", { timeout: 5000 });
  await page
    .locator(".input-email input")
    .fill(process.env.REACT_APP_TEST_EMAIL);
  await page
    .locator(".input-password input")
    .fill(process.env.REACT_APP_TEST_PASSWORD);

  // Click login button
  await page.click('button:has-text("Login")');

  // Wait for successful navigation
  await page.waitForURL("http://localhost:3000/#/projects", { timeout: 10000 });
});

test("Reset Password Test", async ({ page, request }) => {
  await page.goto("http://localhost:3000/#/forgot-password");

  // Fill in email
  await page.locator("input").fill(process.env.REACT_APP_TEST_EMAIL);

  // Intercept API Request
  const [response] = await Promise.all([
    page.waitForResponse(
      (res) =>
        res.url().includes("/users/auth/users/reset_password/") &&
        res.request().method() === "POST"
    ),
    page.click('button:has-text("Send link")'), // Click the button
  ]);

  // Validate API Request Payload
  const requestBody = JSON.parse(await response.request().postData());
  expect(requestBody).toEqual({ email: process.env.REACT_APP_TEST_EMAIL });

  // Validate API Response
  const responseBody = await response.json();
  expect(responseBody).toEqual({
    message:
      "Please check your registered email and click on the link to reset your password.",
  });
});

import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, ".env") });

// Log to verify environment variables are loaded correctly
console.log("Loaded EMAIL:", process.env.REACT_APP_TEST_EMAIL);
console.log("Loaded PASSWORD:", process.env.REACT_APP_TEST_PASSWORD);

export default defineConfig({
  testDir: "./Tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],

  // Ensure React dev server runs before tests
  webServer: {
    command: "npm start", // React runs on `npm start`
    url: "http://localhost:3000/",
    reuseExistingServer: !process.env.CI,
    timeout: 200000, // Increase timeout to 120 seconds
  },
});

import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./test", // Directory where tests are stored
  use: {
    headless: true, // Run tests in headless mode (no UI)
    baseURL: "http://localhost:3000/#", // Base URL for your Next.js app
    viewport: { width: 1280, height: 720 }, // Default viewport size
    trace: "on", // Enable tracing for debugging
    video: "on", // Record video of failed tests
  },
  webServer: {
    command: "npm run dev", // Start Next.js before tests run
    port: 3000, // Ensure this matches your app's port
    timeout: 120 * 1000, // Wait up to 120s for the server to start
    reuseExistingServer: !process.env.CI, // Reuse server locally, start fresh in CI
  },
});

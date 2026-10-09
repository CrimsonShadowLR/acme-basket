import { defineConfig, devices } from "@playwright/test";

// Runs against the real stack: the prod frontend and backend images, started
// by docker-compose.e2e.yml. BASE_URL points at the frontend container.
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: "list",
  use: {
    baseURL: process.env.BASE_URL ?? "http://localhost:3000",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    // Firefox too: Next supports it back to version 111, and an API like
    // toSpliced once broke the basket there.
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
  ],
});

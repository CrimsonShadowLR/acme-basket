import { defineConfig } from "vitest/config";

// Unit tests for plain functions only. Components are covered by the browser
// E2E suite in e2e/, and the backend owns every price.
export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
  },
});

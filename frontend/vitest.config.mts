import { defineConfig } from "vitest/config";

// Unit tests for plain functions only; components are checked by hand and by
// the backend's e2e suite, which owns every price.
export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
  },
});

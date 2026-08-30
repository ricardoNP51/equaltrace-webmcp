import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    include: ["tests/**/*.test.{ts,tsx}"],
    setupFiles: ["./src/test/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary"],
      reportsDirectory: "coverage",
      include: [
        "src/core/compare.ts",
        "src/core/repair.ts",
        "src/state/WorkbenchStore.ts",
        "src/webmcp/repairCapability.ts",
      ],
      thresholds: {
        statements: 79,
        branches: 73,
        functions: 95,
        lines: 80,
      },
    },
  },
});

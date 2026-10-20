import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["test/**/*.test.ts", "packages/*/test/**/*.test.ts"],
    environment: "node",
    setupFiles: ["test/setup.ts"],
    typecheck: {
      // Multi-plugin composition is where the namespace inference actually
      // gets exercised, so the type-level guard belongs here rather than only
      // in the core repo.
      include: ["test/**/*.test-d.ts"],
      tsconfig: "./tsconfig.json",
    },
  },
});

import { defineConfig } from "vitest/config";

// Separate from vite.config.ts so the Tauri dev/build path is untouched.
export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
  },
});

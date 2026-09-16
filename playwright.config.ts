import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/browser",
  use: {
    baseURL: "http://localhost:3017",
    ...(process.env.TEST_WEBKIT
      ? { browserName: "webkit" as const }
      : { channel: "msedge" }),
  },
  webServer: {
    command: "npm run start",
    url: "http://localhost:3017",
    reuseExistingServer: true,
  },
});

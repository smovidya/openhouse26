// @ts-check
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";
import toolbarApp from "./toolbar-app/my-integration";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },

    sessionKVBindingName: "openhouse26_kv",
    workerEntryPoint: {
      path: "src/workers/index.ts",
      namedExports: ["WorkshopRegistrationHandler"],
    },
    imageService: "compile",
  }),
  integrations: [
    svelte({
      extensions: [".svelte"],
    }),
    toolbarApp,
    react(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  output: "server",
});

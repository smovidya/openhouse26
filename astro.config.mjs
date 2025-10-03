// @ts-check
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";
import toolbarApp from "./toolbar-app/my-integration";

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
    sessionKVBindingName: "openhouse26_kv",
    workerEntryPoint: {
      path: "src/workers/index.ts",
      namedExports: [],
    },
    imageService: "compile",
  }),
  integrations: [
    svelte({
      extensions: [".svelte"],
    }),
    toolbarApp,
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  output: "server",
});

// @ts-check
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
    sessionKVBindingName: "openhouse26_kv",
    workerEntryPoint: {
      path: "src/workers/index.ts",
      namedExports: []
    },
  }),
  integrations: [
    svelte({
      extensions: [".svelte"],
    }),
  ],
});

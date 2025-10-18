import { handle } from "@astrojs/cloudflare/handler";
import type { SSRManifest } from "astro";
import { App } from "astro/app";
import { syncGoogleSheetWithDatabase } from "./export-google-sheet";

export function createExports(manifest: SSRManifest) {
  const app = new App(manifest);
  return {
    default: {
      async fetch(request, env, ctx) {
        return handle(manifest, app, request as any, env as any, ctx);
      },
      async scheduled(event, env, ctx) {
        console.log("Scheduled event triggered:", event);
        await env.SyncGoogleSheetWithDatabase.create();
      },
    } satisfies ExportedHandler<Env>,
    syncGoogleSheetWithDatabase,
  };
}

import { handle } from "@astrojs/cloudflare/handler";
import type { SSRManifest } from "astro";
import { App } from "astro/app";
import { WorkshopRegistrationHandler2 } from "./workshop-registration";

export { WorkshopRegistrationHandler2 };

export function createExports(manifest: SSRManifest) {
  const app = new App(manifest);
  return {
    default: {
      async fetch(request, env, ctx) {
        return handle(manifest, app, request as any, env as any, ctx);
      },
    } satisfies ExportedHandler<Env>,
    
    WorkshopRegistrationHandler2
  };
}

import type { SSRManifest } from "astro";
import { App } from "astro/app";
import { handle } from "@astrojs/cloudflare/handler";
// import { DurableObject } from "cloudflare:workers";

// class MyDurableObject extends DurableObject<Env> {
//   constructor(ctx: DurableObjectState, env: Env) {
//     super(ctx, env);
//   }
// }

export function createExports(manifest: SSRManifest) {
  const app = new App(manifest);
  return {
    default: {
      async fetch(request, env, ctx) {
        console.log(request);
        return handle(manifest, app, request, env, ctx);
      },
      // async queue(batch, _env) {
      //   let messages = JSON.stringify(batch.messages);
      //   console.log(`consumed from our queue: ${messages}`);
      // },
    } satisfies ExportedHandler<Env>,
    // MyDurableObject: MyDurableObject,
  };
}

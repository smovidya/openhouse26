import { handle } from "@astrojs/cloudflare/handler";

export function createExports() {
  return {
    default: {
      async fetch(request, env, ctx) {
        return handle(request, env, ctx);
      },
    } satisfies ExportedHandler<Env>,
  };
}

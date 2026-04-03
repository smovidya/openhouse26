import { handle } from "@astrojs/cloudflare/handler";

export default {
  async fetch(request, env, ctx) {
    const requestURL = new URL(request.url);
    if (requestURL.pathname.startsWith("/certs/")) {
      if (requestURL.searchParams.get("s") !== env.RENDER_SECRET) {
        return new Response("Unauthorized", { status: 401 });
      }
      return env.ASSETS.fetch(request);
    }
    return handle(request, env, ctx);
  },
} satisfies ExportedHandler<Env>;

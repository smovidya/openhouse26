import { createAuth } from "@src/auth";
import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

export const prerender = false;

export const ALL: APIRoute = async (ctx) => {
  const auth = createAuth(env, ctx.request.cf);
  return auth.handler(ctx.request);
};

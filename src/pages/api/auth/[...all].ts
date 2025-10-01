import { createAuth } from "@src/auth";
import type { APIRoute } from "astro";

export const prerender = false;

export const ALL: APIRoute = async (ctx) => {
  const auth = createAuth(ctx.locals.runtime.env, ctx.locals.runtime.cf);
  return auth.handler(ctx.request);
};

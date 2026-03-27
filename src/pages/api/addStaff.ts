import { createAuth } from "@src/auth";
import { hasOneOfRoleIn } from '@src/auth/utils';
import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import * as model from "@src/db/model"

export const prerender = false;

export const GET: APIRoute = async (ctx) => {
  if (!ctx.locals.user) return new Response("Unauthorized", { status: 401 });
  if (!hasOneOfRoleIn(ctx.locals.user, ["admin"])) return new Response("Unauthorized", { status: 401 });

  const booth = ctx.url.searchParams.get("booth");
  const email = ctx.url.searchParams.get("email");
  const name = ctx.url.searchParams.get("name");
  const phone = ctx.url.searchParams.get("phone");
  const roles = ctx.url.searchParams.get("roles");
  const studentId = ctx.url.searchParams.get("studentId");

  if (!booth || !email || !name || !phone || !roles || !studentId) {
    return new Response("Missing parameters", { status: 400 });
  }

  const result = await model.staff.addStaff(ctx.locals.db, {
    booth,
    emails: email,
    name,
    phone,
    roles,
    studentId,
  })

  return new Response(JSON.stringify(result), { status: 200 });
};

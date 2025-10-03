import { schema } from "@src/db";
import type { APIRoute } from "astro";
import { roles } from "@src/auth/permissions";
import { eq } from "drizzle-orm";

export const prerender = false;

export const POST: APIRoute = async (ctx) => {
  const validRoles = Object.keys(roles);
  const body = await ctx.request.json<{
    role: string | null | undefined;
  }>();

  const splittedRoles = body.role?.split(",").map((r) => r.trim()) || [];
  const isValid = splittedRoles.every((r) => validRoles.includes(r));
  if (!isValid) {
    return new Response("Invalid role", { status: 400 });
  }

  if (!ctx.locals.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  await ctx.locals.db
    .update(schema.users)
    .set({
      role: body.role,
    })
    .where(eq(schema.users.id, ctx.locals.user?.id));

  return new Response("Role updated", { status: 200 });
};

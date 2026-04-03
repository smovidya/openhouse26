import { createAuth } from "@src/auth";
import { defineMiddleware } from "astro:middleware";
import { drizzle } from "drizzle-orm/d1";
import { schema } from "@src/db";
import { hasOneOfRoleIn } from "./auth/utils";
import { env } from "cloudflare:workers";

export const onRequest = defineMiddleware(async (context, next) => {
  const auth = createAuth(env, context.request.cf);
  const db = drizzle(env.openhouse26_2_db, {
    schema,
    logger: import.meta.env.DB_QUERY_DEBUG === "true",
  });

  const isAuthed = await auth.api.getSession({
    headers: context.request.headers,
  });

  context.locals.db = db;
  context.locals.auth = auth;

  if (isAuthed) {
    context.locals.user = isAuthed.user;
    context.locals.session = isAuthed.session;
  } else {
    context.locals.user = null;
    context.locals.session = null;
  }

  const pathname = new URL(context.request.url).pathname;

  if (
    pathname.startsWith("/admin") &&
    !hasOneOfRoleIn(context.locals.user, ["admin"])
  ) {
    return context.redirect("/");
  }

  if (
    pathname.startsWith("/staff") &&
    !hasOneOfRoleIn(context.locals.user, [
      "admin",
      "majorBoothStaff",
      "registarStaff",
      "rewardStaff",
      "workshopStaff",
    ]) &&
    pathname !== "/staff/login"
  ) {
    return context.redirect("/staff/login");
  }

  return next();
});

import { createAuth } from "@src/auth";
import { defineMiddleware } from "astro:middleware";
import { drizzle } from "drizzle-orm/d1";
import { schema } from "@src/db";
import { hasOneOfRoleIn } from "./auth/utils";

export const onRequest = defineMiddleware(async (context, next) => {
  const auth = createAuth(
    context.locals.runtime.env,
    context.locals.runtime.cf,
  );
  const db = drizzle(context.locals.runtime.env.openhouse26_db, {
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
    pathname === "/admin" &&
    // @ts-ignore pinky swear this is correct - ptsgrn
    !hasOneOfRoleIn(context.locals.user, ["admin"])
  ) {
    return context.redirect("/");
  }

  if (
    pathname.startsWith("/staff") &&
    // @ts-ignore pinky swear this is correct - ptsgrn
    !hasOneOfRoleIn(context.locals.user, [
      "admin",
      "majorBoothStaff",
      "registarStaff",
      "rewardStaff",
      "workshopStaff",
    ])
  ) {
    return context.redirect("/");
  }

  return next();
});

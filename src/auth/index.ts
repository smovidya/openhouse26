import type { D1Database } from "@cloudflare/workers-types";
import { adminModel, authModel, schema, staffModel } from "@src/db";
import { betterAuth, type BetterAuthOptions, type Prettify } from "better-auth";
import { withCloudflare } from "better-auth-cloudflare";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, jwt, oneTap } from "better-auth/plugins";
import { drizzle, DrizzleD1Database } from "drizzle-orm/d1";
import {
  ac,
  admin as adminRole,
  majorBoothStaff,
  registarStaff,
  rewardStaff,
  user,
  workshopStaff,
} from "./permissions";
import { eq } from "drizzle-orm";

function createAuth(env?: Env, cf?: IncomingRequestCfProperties) {
  // Use actual DB for runtime, empty object for CLI
  const db = env
    ? drizzle(env.openhouse26_2_db, { schema, logger: true })
    : ({} as any);

  const betterAuthOptions = {
    ...(env
      ? {}
      : {
          database: drizzleAdapter({} as D1Database, {
            provider: "sqlite",
            usePlural: true,
            debugLogs: false,
          }),
        }),
    plugins: [
      admin({
        ac,
        roles: {
          admin: adminRole,
          majorBoothStaff,
          registarStaff,
          rewardStaff,
          workshopStaff,
          user,
        },
      }),
      oneTap(),
      jwt(),
    ],
    logger: {
      level: "error", // =-= แม่นหยัง
    },
    secret: env?.BETTER_AUTH_SECRET,
    baseURL: env?.BETTER_AUTH_URL,
    emailAndPassword: {
      enabled: true,
    },
    rateLimit: {
      enabled: true,
      window: 120,
    },
    trustedOrigins: (request) => {
      if (!request) return [];
      if (import.meta.env.DEV) return [new URL(request.url).origin];
      return [env?.BETTER_AUTH_URL || ""];
    },
    // disabledPaths: [
    //   import.meta.env.DEV ? null : "/sign-in/anonymous",
    // ].filter(Boolean),
    socialProviders: {
      google: {
        prompt: "select_account",
        clientId: env?.GOOGLE_CLIENT_ID ?? "",
        clientSecret: env?.GOOGLE_CLIENT_SECRET,
      },
    },
    databaseHooks: {
      session: {
        create: {
          async after(session, context) {
            try {
              const user = await db
                .select()
                .from(schema.users)
                .where(eq(schema.users.id, session.userId))
                .get();
              if (!user) return;
              const staffAccount = await adminModel.getStaffByEmail(
                db,
                user?.email,
              );
              if (!staffAccount) return;
              const requestedRole = JSON.parse(
                staffAccount.requestedRole || "[]",
              ) as string[];
              await authModel.linkStaffToUser(db, staffAccount.id, user.id);
              await db
                .update(schema.users)
                .set({
                  role: requestedRole.join(","),
                })
                .where(eq(schema.users.id, user.id));
              // remove sessions to force re-login
              await db
                .delete(schema.sessions)
                .where(eq(schema.sessions.userId, user.id));
            } catch (error) {
              // quietly fail
              console.error("Error linking staff to user:", error);
            }
          },
        },
      },
    },
  } satisfies BetterAuthOptions;

  return betterAuth({
    ...withCloudflare(
      {
        autoDetectIpAddress: true,
        geolocationTracking: true,
        cf: cf || {},
        d1: env
          ? {
              db,
              options: {
                usePlural: true,
                debugLogs: true,
              },
            }
          : undefined,
        // @ts-ignore
        kv: env?.openhouse26_2_kv,
      },
      betterAuthOptions,
    ),
    // Only add database adapter for CLI schema generation
    ...(env
      ? {}
      : {
          database: drizzleAdapter({} as D1Database, {
            provider: "sqlite",
            usePlural: true,
            debugLogs: true,
          }),
        }),
  });
}

// export const auth = createAuth();

// Export for runtime usage
export { createAuth };

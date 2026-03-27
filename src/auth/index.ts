import { betterAuth, type BetterAuthOptions } from "better-auth";
import { withCloudflare } from "better-auth-cloudflare";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, anonymous, jwt, oneTap } from "better-auth/plugins";
import { drizzle, DrizzleD1Database } from "drizzle-orm/d1";
import { schema } from "@src/db";
import * as model from "@src/db/model";
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

function createAuth(env?: Env, cf?: CfProperties) {
  // Use actual DB for runtime, empty object for CLI
  const db = env
    ? drizzle(env.openhouse26_2_db, { schema, logger: true })
    : ({} as any as DrizzleD1Database<typeof schema>);

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
      anonymous({
        emailDomainName: "anon.scichulaopenhouse.com",
      }),
    ],
    appName: "Sci Chula Open House 26",
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
    socialProviders: {
      google: {
        prompt: "select_account",
        clientId: env?.GOOGLE_CLIENT_ID ?? "",
        clientSecret: env?.GOOGLE_CLIENT_SECRET,
      },
    },
    user: {
      additionalFields: {
        staffId: {
          type: "string",
          returned: true,
        },
        attendeeTicketCode: {
          type: "string",
        },
      },
    },
    databaseHooks: {
      session: {
        create: {
          after: async (session, ctx) => {
            try {
              const user = await db
                .select()
                .from(schema.users)
                .where(eq(schema.users.id, session.userId))
                .get();
              console.log("user", user);
              if (!user) return;
              const staffAccount = await model.staff.getStaffByEmail(
                db,
                user.email,
              );

              console.log("staffAccount", staffAccount);

              if (!staffAccount) return;

              const requestedRole = staffAccount.requestedRole;
              console.log("requestedRole", requestedRole);
              if (!requestedRole) return;

              await db
                .update(schema.users)
                .set({
                  staffId: staffAccount.id,
                  role: requestedRole,
                })
                .where(eq(schema.users.id, session.userId));

              await db
                .delete(schema.sessions)
                .where(eq(schema.sessions.userId, user.id));
            } catch (error) {
              console.error("Error in session create hook:", error);
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
        // @ts-ignore
        cf: cf || {},
        // @ts-ignore
        d1: env
          ? {
              db,
              options: {
                usePlural: true,
                debugLogs: false,
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
            debugLogs: false,
          }),
        }),
  });
}

// export const auth = createAuth();

// Export for runtime usage
export { createAuth };

import type {
  D1Database,
  IncomingRequestCfProperties,
} from "@cloudflare/workers-types";
import { betterAuth } from "better-auth";
import { withCloudflare } from "better-auth-cloudflare";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle, DrizzleD1Database } from "drizzle-orm/d1";
import { schema } from "@src/db";
import { admin, anonymous, oneTap } from "better-auth/plugins";
import {
  admin as adminRole,
  ac,
  majorBoothStaff,
  registarStaff,
  rewardStaff,
  workshopStaff,
  user,
} from "./permissions";

// Single auth configuration that handles both CLI and runtime scenarios
function createAuth(env?: Env, cf?: IncomingRequestCfProperties) {
  // Use actual DB for runtime, empty object for CLI
  const db = (
    env ? drizzle(env.openhouse26_db, { schema, logger: true }) : ({} as any)
  ) as DrizzleD1Database<typeof schema>;

  return betterAuth({
    ...withCloudflare(
      {
        autoDetectIpAddress: true,
        geolocationTracking: true,
        cf: cf || {},
        // @ts-ignore
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
        kv: env?.openhouse26_kv,
        // Optional: Enable R2 file storage
        // r2: {
        //   bucket: env.R2_BUCKET,
        //   maxFileSize: 10 * 1024 * 1024, // 10MB
        //   allowedTypes: [
        //     ".jpg",
        //     ".jpeg",
        //     ".png",
        //     ".gif",
        //     ".pdf",
        //     ".doc",
        //     ".docx",
        //   ],
        //   additionalFields: {
        //     category: { type: "string", required: false },
        //     isPublic: { type: "boolean", required: false },
        //     description: { type: "string", required: false },
        //   },
        // },
      },
      {
        logger: {
          level: "debug", // =-= แม่นหยัง
        },
        secret: env?.BETTER_AUTH_SECRET,
        baseURL: env?.BETTER_AUTH_URL,
        emailAndPassword: {
          enabled: true,
        },
        rateLimit: {
          enabled: true,
          window: 60
        },
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
          // anonymous({
          //   emailDomainName: "anon.vidyachula.org",
          //   // async onLinkAccount({ anonymousUser, newUser }) {
          //   //   await db.update(schema.users).set({
          //   //   })
          //   // },
          // }),
          oneTap(),
        ],
        // disabledPaths: [
        //   import.meta.env.DEV ? null : "/sign-in/anonymous",
        // ].filter(Boolean),
        socialProviders: {
          google: {
            prompt: "select_account",
            clientId: env?.GOOGLE_CLIENT_ID,
            clientSecret: env?.GOOGLE_CLIENT_SECRET,
          },
        },
      }
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

// Export for CLI schema generation
export const auth = createAuth();

// Export for runtime usage
export { createAuth };

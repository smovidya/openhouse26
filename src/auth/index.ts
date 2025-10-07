import type {
  D1Database,
  IncomingRequestCfProperties,
} from "@cloudflare/workers-types";
import { schema } from "@src/db";
import { betterAuth } from "better-auth";
import { withCloudflare } from "better-auth-cloudflare";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, oneTap } from "better-auth/plugins";
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
        kv: env?.openhouse26_kv
          ? {
              delete: async (key: string) => {
                return env?.openhouse26_kv.delete(key);
              },
              get: async (key: string) => {
                return env?.openhouse26_kv.get(key);
              },
              put(key, value, options) {
                return env.openhouse26_kv.put(key, value as any, {
                  ...options,
                  expirationTtl: Math.max(options?.expirationTtl ?? 120, 120),
                });
              },
            }
          : undefined,
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
      {}
    ),
    // rateLimit: {
    //   enabled: true,
    //   ttl: 120
    // },
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
      window: 120,
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
  });
}

// Export for CLI schema generation
// export const auth = createAuth();

// Export for runtime usage
export { createAuth };

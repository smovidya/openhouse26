import type {
  D1Database,
  IncomingRequestCfProperties,
} from "@cloudflare/workers-types";
import { betterAuth } from "better-auth";
import { withCloudflare } from "better-auth-cloudflare";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/d1";
import { schema } from "../db/schema";
import { admin, anonymous, oAuthProxy, oneTap } from "better-auth/plugins";
import { passkey } from "better-auth/plugins/passkey";

// Single auth configuration that handles both CLI and runtime scenarios
function createAuth(env?: Env, cf?: IncomingRequestCfProperties) {
  // Use actual DB for runtime, empty object for CLI
  const db = env
    ? drizzle(env.openhouse26_db, { schema, logger: true })
    : ({} as any);

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
        emailAndPassword: {
          enabled: true,
        },
        rateLimit: {
          enabled: true,
        },
        plugins: [
          admin(),
          anonymous({
            emailDomainName: "anon.vidyachula.org",
          }),
          oneTap(),
          oAuthProxy(),
        ],
        socialProviders: {
          google: {
            prompt: "select_account",
            clientId: env?.GOOGLE_CLIENT_ID,
            clientSecret: env?.GOOGLE_CLIENT_SECRET,
            redirectURI:
              "https://scichulaopenhouse.com/api/auth/callback/github",
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

/// <reference types="astro/client" />

// use a default runtime configuration (advanced mode).
type Runtime = import("@astrojs/cloudflare").Runtime<Env>;
declare namespace App {
  interface Locals extends Runtime {
    db: import("drizzle-orm/d1").DrizzleD1Database<
      typeof import("@src/db").schema
    >;
    auth: import("better-auth").Auth;
    user: import("better-auth").User | null;
    session: import("better-auth").Session | null;
  }
}

/// <reference types="astro/client" />

// use a default runtime configuration (advanced mode).
type Runtime = import("@astrojs/cloudflare").Runtime<Env>;
type Auth = ReturnType<typeof import("@src/auth").createAuth>;
declare namespace App {
  interface Locals extends Runtime {
    db: import("drizzle-orm/d1").DrizzleD1Database<
      typeof import("@src/db").schema
    >;
    auth: Auth;
    user: Auth["$Infer"]["Session"]["user"] | null;
    session: Auth["$Infer"]["Session"]["session"] | null;
  }
}

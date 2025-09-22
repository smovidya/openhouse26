/// <reference types="astro/client" />

// use a default runtime configuration (advanced mode).
type Runtime = import("@astrojs/cloudflare").Runtime<Env>;
declare namespace App {
  interface Locals extends Runtime {
    auth: import("better-auth").Auth;
    user: import("better-auth").User | null;
    session: import("better-auth").Session | null;
  }
}

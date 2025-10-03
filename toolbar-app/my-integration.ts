import { fileURLToPath } from "node:url";
import type { AstroIntegration } from "astro";

export default {
  name: "my-astro-integration",
  hooks: {
    "astro:config:setup": ({ addDevToolbarApp }) => {
      addDevToolbarApp({
        id: "better-auth-user-mock",
        name: "Auth Inspector",
        icon: "🕵️",
        entrypoint: fileURLToPath(new URL("./app.ts", import.meta.url)),
      });
    },
  },
} satisfies AstroIntegration;

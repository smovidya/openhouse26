import { getLocalD1DB } from "@src/db/getDbFile";
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema",
  dialect: "sqlite",
  dbCredentials: {
    url: 'file:./local.db'
  },
});

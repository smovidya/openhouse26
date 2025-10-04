import { schema } from "./schema";
import type { DrizzleD1Database } from "drizzle-orm/d1";

export type Db = DrizzleD1Database<typeof schema>;

export * from "./schema";
export * from "./model";

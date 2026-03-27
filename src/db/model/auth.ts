import type { Db } from "..";
import { users } from "../schema/auth.schema";
import { eq } from "drizzle-orm";

export const getUserByEmail = async (db: Db, email: string) =>
  db.select().from(users).where(eq(users.email, email)).get();

import { createId } from "@paralleldrive/cuid2";
import { integer, text } from "drizzle-orm/sqlite-core";

export const id = {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
};

export const timestamps = {
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
};

export const deletedAt = {
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
};

import { getLocalD1DB } from "@src/db/getDbFile";
import { createClient } from "@libsql/client";
import { schema } from "../schema";
import { drizzle } from "drizzle-orm/libsql";
import { asc, eq } from "drizzle-orm";

async function main() {
  const db = drizzle({
    client: createClient({
      url: getLocalD1DB(),
    }),
    schema,
  });

  const checkpoints = await db.query.checkpoints.findMany();

  for (const checkpoint of checkpoints) {
    // {
    //   id: "workshop-culturex",
    //   name: "กิจกรรม Workshop: CultureX: Preparing For Take Off!",
    //   note: null,
    //   type: "workshop",
    //   createdAt: 2025-10-12T17:06:05.000Z,
    //   updatedAt: 2025-10-12T17:06:05.000Z,
    //   deletedAt: null,
    // }
    console.log(
      `INSERT INTO checkpoints (id, name, note, type, created_at, updated_at, deleted_at) VALUES ('${checkpoint.id}', '${checkpoint.name}', '${checkpoint.note || ""}', '${checkpoint.type}', ${checkpoint.createdAt?.getTime()}, ${checkpoint.updatedAt?.getTime()}, ${checkpoint.deletedAt?.getTime() || null});`,
    );
  }
}
main();

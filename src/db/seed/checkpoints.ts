import { checkpoints } from "@src/data/checkpoints";
import { getLocalD1DB } from "@src/db/getDbFile";
import { createClient } from "@libsql/client";
import { schema } from "../schema";
import { drizzle } from "drizzle-orm/libsql";
import { eq } from "drizzle-orm";

async function main() {
  const db = drizzle({
    client: createClient({
      url: getLocalD1DB(),
    }),
    schema,
  });

  for (const checkpoint of checkpoints) {
    console.log(`🌟 Inserting checkpoint: ${checkpoint.name}`);
    await db.transaction(async (tx) => {
      const existingCheckpoint = await tx
        .select({
          id: schema.checkpoints.id,
        })
        .from(schema.checkpoints)
        .where(eq(schema.checkpoints.id, checkpoint.id as string))
        .get();
      if (existingCheckpoint) {
        console.log(
          `Checkpoint ${checkpoint.name} already exists, removing...`,
        );
        await tx
          .delete(schema.checkpoints)
          .where(eq(schema.checkpoints.id, checkpoint.id as string))
          .returning()
          .get();
        console.log(`Removed existing checkpoint ${checkpoint.name}`);
      }
      await tx
        .insert(schema.checkpoints)
        .values({
          id: checkpoint.id,
          name: checkpoint.name,
          type: checkpoint.type,
        })
        .returning()
        .get();
      console.log(`Inserted checkpoint: ${checkpoint.name}`);
      console.log("------------------------------");
    });
  }
}

main();

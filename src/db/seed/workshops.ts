import { workshops } from "@src/data/workshops";
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

  for (const workshop of workshops) {
    console.log(`🌟 Inserting workshop: ${workshop.title}`);
    console.log(`Capacity: ${workshop.capacity}`);
    console.log(`Description: ${workshop.description}`);
    console.log(
      `Host Department: ${workshop.hostDepartment} (${workshop.hostDepartmentAbbr})`,
    );
    console.log(`Image: ${workshop.image}`);
    await db.transaction(async (tx) => {
      const existingWorkshop = await tx
        .select({
          id: schema.workshops.id,
        })
        .from(schema.workshops)
        .where(eq(schema.workshops.id, workshop.id))
        .get();
      if (existingWorkshop) {
        console.log(`Workshop ${workshop.title} already exists, removing...`);

        await tx
          .delete(schema.workshopTimeSlots)
          .where(eq(schema.workshopTimeSlots.workshopId, workshop.id))
          .returning()
          .all();

        await tx
          .delete(schema.workshops)
          .where(eq(schema.workshops.id, workshop.id))
          .returning()
          .get();

        console.log(`Removed existing workshop ${workshop.title}`);
      }

      await tx
        .insert(schema.workshops)
        .values({
          id: workshop.id,
          title: workshop.title,
          description: workshop.description,
          hostDepartment: workshop.hostDepartment,
          hostDepartmentAbbr: workshop.hostDepartmentAbbr,
          image: workshop.image,
          capacity: workshop.capacity,
        })
        .returning()
        .get();

      for (const slot of workshop.slots) {
        const result = await tx
          .insert(schema.workshopTimeSlots)
          .values({
            workshopId: workshop.id,
            roundNumber: slot.round,
            startTime: slot.start.toString(),
            endTime: slot.end.toString(),
            date: slot.date,
          })
          .returning()
          .get();
        console.log(
          `  Inserted slot: ${slot.round} (${slot.date.toDateString()} ${slot.start.toString()} - ${slot.end.toString()})`,
        );
      }

      console.log(`Inserted workshop: ${workshop.title}`);
      console.log("------------------------------");
    });
  }
}

main();

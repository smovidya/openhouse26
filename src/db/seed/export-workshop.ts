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

  const workshops = await db.query.workshops.findMany();
  for (const workshop of workshops) {
    console.log(
      `INSERT INTO workshops (
      id, title, host_department, host_department_abbr, description, image, capacity, created_at, updated_at
    ) VALUES (
      '${workshop.id}',
      '${workshop.title}',
      '${workshop.hostDepartment}',
      '${workshop.hostDepartmentAbbr}',
      '${workshop.description.replace(/'/g, "''")}',
      '${workshop.image}',
      ${workshop.capacity},
      ${workshop.createdAt ? new Date(workshop.createdAt).getTime() : null},
      ${workshop.updatedAt ? new Date(workshop.updatedAt).getTime() : null}
    );`.replace(/\n/g, " "),
    );

    const timeSlots = await db.query.workshopTimeSlots.findMany({
      where: eq(schema.workshopTimeSlots.workshopId, workshop.id),
      orderBy: asc(schema.workshopTimeSlots.roundNumber),
    });

    for (const slot of timeSlots) {
      console.log(
        `INSERT INTO workshop_time_slots (
        id, workshop_id, round_number, start_time, end_time, date
      ) VALUES (
        '${slot.id}',
        '${slot.workshopId}',
        ${slot.roundNumber},
        '${slot.startTime}',
        '${slot.endTime}',
        ${slot.date?.getTime()}
      );`.replace(/(\n| ){1,}/g, " "),
      );
    }
  }
}

main();

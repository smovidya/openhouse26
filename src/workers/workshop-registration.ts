import type { SelectedWorkshop } from "@src/client/shared-state.svelte";
import { getWorkshopById, workshops } from "@src/data/workshops";
import { DurableObject } from "cloudflare:workers";

export type SelectedWorkshopWithUser = SelectedWorkshop & {
  participantId: string;
};

export class WorkshopRegistrationHandler2 extends DurableObject<Env> {
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);

    this.ctx.blockConcurrencyWhile(async () => {
      this.init();
    });
  }

  init() {
    this.ctx.storage.sql.exec(`
      CREATE TABLE IF NOT EXISTS registrations (
        participantId TEXT NOT NULL,
        workshopId TEXT NOT NULL,
        roundNumber INTEGER NOT NULL,
        PRIMARY KEY (participantId, workshopId)
      )
    `);

    // Create indexes for better query performance
    this.ctx.storage.sql.exec(`
      CREATE INDEX IF NOT EXISTS idx_workshop_round 
      ON registrations(workshopId, roundNumber)
    `);

    this.ctx.storage.sql.exec(`
      CREATE INDEX IF NOT EXISTS idx_participant_round 
      ON registrations(participantId, roundNumber)
    `);

    this.ctx.storage.sql.exec(`
      CREATE INDEX IF NOT EXISTS idx_round 
      ON registrations(roundNumber)
    `);

    this.ctx.storage.sql.exec(`
      CREATE INDEX IF NOT EXISTS idx_workshop 
      ON registrations(workshopId)
    `);

    this.ctx.storage.sql.exec(`
      CREATE INDEX IF NOT EXISTS idx_participant 
      ON registrations(participantId)
    `);
  }

  listAll(): SelectedWorkshopWithUser[] {
    const results = this.ctx.storage.sql.exec(`
      SELECT participantId, workshopId, roundNumber
      FROM registrations
    `);

    return results.toArray().map((row: Record<string, unknown>) => ({
      participantId: row.participantId as string,
      workshopId: row.workshopId as string,
      roundNumber: row.roundNumber as number
    }));
  }

  setRegistration(participantId: string, workshopId: string, roundNumber: number) {
    // Check if user is already registered for this workshop
    const existingResult = this.ctx.storage.sql.exec(`
      SELECT COUNT(*) as count
      FROM registrations
      WHERE participantId = '${participantId}' AND workshopId = '${workshopId}'
    `);

    const isAlreadyRegistered = (existingResult.toArray()[0] as Record<string, unknown>)?.count as number > 0;
    if (isAlreadyRegistered) {
      this.removeRegistration(participantId, workshopId);
    }

    return this.addRegistration(participantId, workshopId, roundNumber);
  }

  addRegistration(participantId: string, workshopId: string, roundNumber: number) {
    // Check how many users are registered for this workshop at this round
    const registered = this.getRegistrationsByUser(participantId);
    if (registered.length >= 2) {
      return "maximum-workshop-reached" as const;
    }

    const selectedSlot = getWorkshopById(workshopId)?.slots.find(it => it.round === roundNumber);
    if (!selectedSlot) {
      return "not-exist";
    }

    for (const { roundNumber, workshopId } of registered) {
      const other = getWorkshopById(workshopId)!.slots.find(it => it.round === roundNumber)!;

      if (selectedSlot.isIn1Hour(other)) {
        return "collided";
      }
    }

    // Check how many workshops the user has registered for at this round
    const userCountResult = this.ctx.storage.sql.exec(`
      SELECT COUNT(*) as count
      FROM registrations
      WHERE participantId = '${participantId}' AND roundNumber = ${roundNumber}
    `);
    const userCount = (userCountResult.toArray()[0] as Record<string, unknown>)?.count as number || 0;
    if (userCount >= getWorkshopById(workshopId)!.capacity) {
      return "workshop-full" as const;
    }

    this.ctx.storage.sql.exec(`
      INSERT OR REPLACE INTO registrations (participantId, workshopId, roundNumber)
      VALUES ('${participantId}', '${workshopId}', ${roundNumber})
    `);

    return this.getRegistrationCount(workshopId);
  }

  removeRegistration(participantId: string, workshopId: string) {
    this.ctx.storage.sql.exec(`
      DELETE FROM registrations
      WHERE participantId = '${participantId}' AND workshopId = '${workshopId}'
    `);

    return this.getRegistrationCount(workshopId);
  }

  getRegistrationCount(workshopId: string): Record<number, number> {
    const results = this.ctx.storage.sql.exec(`
      SELECT roundNumber, COUNT(*) as count
      FROM registrations
      WHERE workshopId = '${workshopId}'
      GROUP BY roundNumber
    `);

    const counts: Record<number, number> = {};
    results.toArray().forEach((row: Record<string, unknown>) => {
      const roundNumber = row.roundNumber as number;
      const count = row.count as number;
      counts[roundNumber] = count;
    });

    return counts;
  }

  getRegistrationsByUser(participantId: string): SelectedWorkshopWithUser[] {
    const results = this.ctx.storage.sql.exec(`
      SELECT participantId, workshopId, roundNumber
      FROM registrations
      WHERE participantId = '${participantId}'
    `);

    return results.toArray().map((row: Record<string, unknown>) => ({
      participantId: row.participantId as string,
      workshopId: row.workshopId as string,
      roundNumber: row.roundNumber as number
    }));
  }
}

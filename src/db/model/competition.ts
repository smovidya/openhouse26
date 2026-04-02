import type { Db } from "..";
import { users } from "../schema/auth.schema";
import { competitors } from "../schema/competitor.schema";
import { staffs } from "../schema/staff.schema";
import { eq } from "drizzle-orm";

export const addNewTeam = async (
  db: Db,
  {
    teamId,
    email,
    phone,
    names,
    tier,
    onlineRoundScore,
  }: {
    teamId: string;
    email: string;
    phone: string;
    names: string[];
    tier: Required<(typeof competitors)["$inferInsert"]["tier"]>;
    onlineRoundScore: number;
  },
) =>
  db
    .insert(competitors)
    .values([
      {
        email,
        teamId,
        phone,
        names,
        tier,
        onlineRoundScore,
      },
    ])
    .returning()
    .get();

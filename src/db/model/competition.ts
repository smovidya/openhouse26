import type { Db } from "..";
import { competitors } from "../schema/competitor.schema";
import type { CompetitorTier } from "@src/data/scilympic";
import { and, desc, eq, isNull, like, or, sql } from "drizzle-orm";

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

export const getTeamByTeamId = async (db: Db, teamId: string) =>
  db.select().from(competitors).where(eq(competitors.teamId, teamId)).get();

export const listCompetitors = async (
  db: Db,
  {
    page,
    limit,
    searchQuery,
    tier,
  }: {
    page: number;
    limit: number;
    searchQuery?: string;
    tier?: CompetitorTier;
  },
) => {
  const where = and(
    isNull(competitors.deletedAt),
    tier ? eq(competitors.tier, tier) : undefined,
    searchQuery?.trim()
      ? or(
          like(competitors.teamId, `%${searchQuery.trim()}%`),
          like(competitors.email, `%${searchQuery.trim()}%`),
          like(competitors.names, `%${searchQuery.trim()}%`),
        )
      : undefined,
  );

  const items = await db
    .select()
    .from(competitors)
    .where(where)
    .orderBy(desc(competitors.createdAt))
    .limit(limit)
    .offset((page - 1) * limit)
    .all();

  const totalResult = await db
    .select({ total: sql<number>`count(*)` })
    .from(competitors)
    .where(where)
    .get();

  return {
    items,
    total: totalResult?.total ?? 0,
  };
};

export const createCompetitor = async (
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
    tier: CompetitorTier;
    onlineRoundScore: number;
  },
) =>
  db
    .insert(competitors)
    .values({
      teamId,
      email,
      phone,
      names,
      tier,
      onlineRoundScore,
    })
    .returning()
    .get();

export const updateCompetitorById = async (
  db: Db,
  {
    id,
    teamId,
    email,
    phone,
    names,
    tier,
    onlineRoundScore,
  }: {
    id: string;
    teamId: string;
    email: string;
    phone: string;
    names: string[];
    tier: CompetitorTier;
    onlineRoundScore: number;
  },
) =>
  db
    .update(competitors)
    .set({
      teamId,
      email,
      phone,
      names,
      tier,
      onlineRoundScore,
      updatedAt: new Date(),
    })
    .where(eq(competitors.id, id))
    .returning()
    .get();

export const softDeleteCompetitorById = async (db: Db, id: string) =>
  db
    .update(competitors)
    .set({
      deletedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(competitors.id, id))
    .returning({ id: competitors.id })
    .get();

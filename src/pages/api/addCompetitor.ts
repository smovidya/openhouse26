import { createAuth } from "@src/auth";
import { hasOneOfRoleIn } from "@src/auth/utils";
import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import * as model from "@src/db/model";

export const prerender = false;

export const GET: APIRoute = async (ctx) => {
  if (!ctx.locals.user) return new Response("Unauthorized", { status: 401 });
  if (!hasOneOfRoleIn(ctx.locals.user, ["admin"]))
    return new Response("Unauthorized", { status: 401 });

  const searchParams = ctx.url.searchParams;

  const teamId = searchParams.get("teamId");
  const email = searchParams.get("email");
  const phone = searchParams.get("phone");
  const names = searchParams.get("names");
  const tier = searchParams.get("tier") as Parameters<
    typeof model.competition.addNewTeam
  >[1]["tier"];
  const onlineRoundScore = searchParams.get("onlineRoundScore");

  if (!teamId || !names || !tier) {
    return new Response("Missing parameters", { status: 400 });
  }

  const namesArray = names.split(",").map((name) => name.trim());

  const result = await model.competition.addNewTeam(ctx.locals.db, {
    email: email || "",
    phone: phone || "",
    teamId,
    names: namesArray,
    tier: tier,
    onlineRoundScore: onlineRoundScore ? +onlineRoundScore * 10 : 0,
  });

  return new Response(JSON.stringify(result), { status: 200 });
};

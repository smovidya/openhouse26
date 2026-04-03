import { sqliteTable } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";
import { deletedAt, id, timestamps } from "./helper";

export const competitors = sqliteTable("competitors", {
  ...id,
  teamId: t.text("team_id"),
  email: t.text("email"),
  phone: t.text("phone"),
  names: t
    .text("names", {
      mode: "json",
    })
    .$type<string[]>(),
  tier: t
    .text("tier")
    .$type<
      | "ชนะเลิศ"
      | "รองชนะเลิศอันดับ 1"
      | "รองชนะเลิศอันดับ 2"
      | "รองชนะเลิศอันดับ 3"
      | "เข้ารอบ 24 ทีม"
      | "เข้ารอบ 60 ทีม"
      | "เข้าร่วมสอบ"
      | "ไม่เข้าสอบ"
    >(),
  // I ain't store ts as float
  onlineRoundScore: t.int("online_round_score"),
  ...deletedAt,
  ...timestamps,
});

import type { Browser, BrowserWorker } from "@cloudflare/puppeteer";
import puppeteer from "@cloudflare/puppeteer";
import { schema, type Db } from "@src/db";
import { eq } from "drizzle-orm";

export const getSurveyByParticipantId = async (db: Db, participantId: string) =>
  db.query.surveys.findFirst({
    where: eq(schema.surveys.participantId, participantId),
  });

export const insertSurvey = async (
  db: Db,
  participantId: string,
  data: unknown,
) =>
  db
    .insert(schema.surveys)
    .values({
      participantId,
      responses: JSON.stringify(data),
    })
    .returning()
    .get();

export const updateParticipantName = async (
  db: Db,
  participantId: string,
  data: {
    givenName: string;
    familyName: string;
  },
) => {
  await db
    .update(schema.surveys)
    .set({
      isNameConfirmed: true,
    })
    .where(eq(schema.surveys.participantId, participantId));
  await db
    .update(schema.participants)
    .set({
      givenName: data.givenName,
      familyName: data.familyName,
    })
    .where(eq(schema.participants.id, participantId));
};

export const getCertificatePdf = async (
  browser: BrowserWorker,
  kv: KVNamespace,
  cacheKvKey: string,
  origin: string,
  name: string,
  code: string,
  token: string,
) => {
  const existing = await kv.get(cacheKvKey, "arrayBuffer");

  if (existing) {
    return new Uint8Array(existing);
  }

  const puppetBrowser = await puppeteer.launch(browser);
  const page = await puppetBrowser.newPage();

  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
  });

  const url = new URL(origin);
  const certificateEndpoint = new URL(url.origin);
  certificateEndpoint.pathname = "/cert/render";
  certificateEndpoint.searchParams.set("name", name);
  certificateEndpoint.searchParams.set("code", code);
  certificateEndpoint.searchParams.set("token", token);

  await page.goto(certificateEndpoint.toString());

  let pdf = await page.pdf({
    landscape: true,
    width: 795,
    height: 560,
    printBackground: true,
    scale: 1.35,
    format: "A4",
  });

  await puppetBrowser.close();

  const uint8 = new Uint8Array(pdf);

  // save to kv
  await kv.put(cacheKvKey, uint8);

  return uint8;
};

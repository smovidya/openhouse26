import type { DB } from "better-auth/adapters/drizzle";
import { survey, type Db } from "..";
import { surveys } from "../schema/survey.schema";
import { eq } from "drizzle-orm";
import type { BrowserWorker } from "@cloudflare/puppeteer";
import puppeteer from "@cloudflare/puppeteer";
import { env } from "cloudflare:workers";

export const getSurveyByTicketId = async (db: Db, ticketId: string) =>
  db
    .select()
    .from(surveys)
    .where(eq(surveys.participantTicketId, ticketId))
    .get();

export const createSurvey = async (
  db: Db,
  {
    ticketId,
    nameInCert,
    responses,
  }: {
    ticketId: string;
    nameInCert: string;
    responses?: unknown;
  },
) => {
  const nextId = (await survey.countAllSurvey(db)) + 1;
  return await db
    .insert(surveys)
    .values({
      participantTicketId: ticketId,
      nameInCert,
      responses: responses || {},
      certIndex: nextId,
    })
    .returning()
    .get();
};

export const countAllSurvey = (db: Db) => db.$count(surveys);

export const getCertificatePdf = async (
  browser: BrowserWorker,
  kv: KVNamespace,
  cacheKvKey: string,
  origin: string,
  name: string,
  certId: number,
) => {
  const existing = await kv.get(cacheKvKey, "arrayBuffer");
  if (existing) {
    return new Uint8Array(existing);
  }

  let puppetBrowser;
  try {
    puppetBrowser = await puppeteer.launch(browser);
    const page = await puppetBrowser.newPage();

    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
    });

    const certificateEndpoint = new URL(origin);
    certificateEndpoint.pathname = "/cert/render";
    certificateEndpoint.searchParams.set("name", name);
    certificateEndpoint.searchParams.set("certId", certId.toString());
    certificateEndpoint.searchParams.set("token", env.BETTER_AUTH_SECRET);

    // Wait until network is fully idle before taking PDF
    await page.goto(certificateEndpoint.toString(), {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    const pdf = await page.pdf({
      landscape: true,
      width: 795,
      height: 560,
      printBackground: true,
      scale: 1.35,
    });

    const uint8 = new Uint8Array(pdf);
    await kv.put(cacheKvKey, uint8);
    return uint8;
  } finally {
    // Always close, even if an error is thrown
    await puppetBrowser?.close();
  }
};

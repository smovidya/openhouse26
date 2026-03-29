import Cloudflare from "cloudflare";
import type { APIRoute } from "astro";
import { ActionError, actions } from "astro:actions";
import jwt from "@tsndr/cloudflare-worker-jwt";
import { env } from "cloudflare:workers";
import * as model from "@src/db/model";
import { eq } from "drizzle-orm";
import { surveys } from "@src/db/schema/survey.schema";
import type { BrowserWorker } from "@cloudflare/puppeteer";
import puppeteer from "@cloudflare/puppeteer";
import renderer from "@astrojs/svelte/server.js";

export const GET: APIRoute = async ({ callAction, url, locals }) => {
  const token = url.searchParams.get("token");
  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  let verifiedJwt = await jwt.verify<{
    readonly name: string;
    readonly sub: string;
    readonly certId: string;
  }>(token, env.BETTER_AUTH_SECRET);

  if (!verifiedJwt) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { name, sub, certId } = verifiedJwt.payload;

  const client = new Cloudflare({
    apiToken: env.API_TOKEN,
  });

  const rendererUrl = new URL("/cert/render", "https://scichulaopenhouse.com");
  rendererUrl.searchParams.set("name", name);
  rendererUrl.searchParams.set("certId", certId.toString());
  rendererUrl.searchParams.set("token", env.BETTER_AUTH_SECRET);

  const pdf = await client.browserRendering.pdf.create({
    account_id: env.CLOUDFLARE_ACCOUNT_ID,
    url: rendererUrl.toString(),
    viewport: {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
      isLandscape: true,
    },
    pdfOptions: {
      landscape: true,
      format: "a4",
      printBackground: true,
      scale: 1.35,
    },
  });

  const blob = await pdf.blob();

  return new Response(blob, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="certificate-${sub}.pdf"`,
    },
  });
};

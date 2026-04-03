import type { APIRoute } from "astro";
import { ActionError, actions } from "astro:actions";
import jwt from "@tsndr/cloudflare-worker-jwt";
import { env } from "cloudflare:workers";
import * as model from "@src/db/model";
import { eq } from "drizzle-orm";
import { surveys } from "@src/db/schema/survey.schema";
import type { BrowserWorker } from "@cloudflare/puppeteer";
import puppeteer from "@cloudflare/puppeteer";

export const GET: APIRoute = async ({ callAction, url, locals }) => {
  const token = url.searchParams.get("token");
  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  let verifiedJwt = await jwt.verify<{
    readonly name: string;
    readonly sub: string;
  }>(token, env.BETTER_AUTH_SECRET);

  if (!verifiedJwt) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { name, sub } = verifiedJwt.payload;

  let { data: certPdf, error: certPdfError } = await callAction(
    actions.redeem.getCertificatePDF,
    {
      token: token,
    },
  );

  if (certPdfError || !certPdf) {
    return new Response(
      certPdfError?.message || "Failed to generate certificate",
      { status: 500 },
    );
  }

  return new Response(new Uint8Array(certPdf.pdfUint8), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="sci-chula-openhouse-2026.pdf"`,
    },
  });
};

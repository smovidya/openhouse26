import Cloudflare from "cloudflare";
import type { APIRoute } from "astro";
import jwt from "@tsndr/cloudflare-worker-jwt";
import { env } from "cloudflare:workers";

export const GET: APIRoute = async ({ callAction, url, locals }) => {
  const token = url.searchParams.get("token");
  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  let verifiedJwt = await jwt.verify<{
    readonly name: string;
    readonly teamId: string;
    readonly tier: string;
  }>(token, env.RENDER_SECRET);

  if (!verifiedJwt) {
    return new Response("Unauthorized", { status: 401 });
  }

  const client = new Cloudflare({
    apiToken: env.API_TOKEN,
  });

  const rendererUrl = new URL(
    "/scilympic/render",
    "https://scichulaopenhouse.com",
  );
  rendererUrl.searchParams.set("token", token);

  // find in kv cache first
  const cached = await env.openhouse26_2_kv.get(token);
  if (cached) {
    console.log(`Cache hit for token ${token}`);
    const blob = new Blob([cached], { type: "application/pdf" });
    return new Response(blob, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="scilympic-certificate-${verifiedJwt.payload.teamId}-${new Date().getTime()}.pdf"`,
      },
    });
  }

  console.log(`Cache miss for token ${token}, rendering...`);

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
      "Content-Disposition": `attachment; filename="scilympic-certificate-${verifiedJwt.payload.teamId}-${new Date().getTime()}.pdf"`,
    },
  });
};

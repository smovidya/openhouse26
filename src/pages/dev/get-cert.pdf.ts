import puppeteer from "@cloudflare/puppeteer";
import type { APIRoute } from "astro";

// export const GET: APIRoute = async ({ request, locals }) => {
//   if ()
//   const browser = await puppeteer.launch(locals.runtime.env.BROWSER);
//   const page = await browser.newPage();
//   await page.setViewport({
//     width: 1920,
//     height: 1080,
//     deviceScaleFactor: 1,
//   });

//   const url = new URL(request.url);
//   await page.goto(
//     `${url.origin}/cert/render?name=%E0%B8%99%E0%B8%B2%E0%B8%A2%E0%B8%9E%E0%B8%B1%E0%B8%AA%E0%B8%81%E0%B8%A3%20%E0%B8%A2%E0%B8%B7%E0%B8%99%E0%B8%A2%E0%B8%87&code=https://cert.vidyachula.org/v/123456789&token=${locals.runtime.env.BETTER_AUTH_SECRET}`,
//   );

//   let pdf = await page.pdf({
//     // quality: 100,
//     // type: "png",
//     // fullPage: true,
//     // omitBackground: false,
//     landscape: true,
//     width: 795,
//     height: 560,
//     format: "a4",
//     printBackground: true,
//     scale: 1.35,
//   });

//   await browser.close();

//   const uint8 = new Uint8Array(pdf);

//   // save to kv
//   await locals.runtime.env.openhouse26_kv.put("certificates/123456789", uint8);

//   return new Response(uint8, {
//     headers: {
//       "Content-Type": "application/pdf",
//       // "Content-Disposition": "attachment; filename=certificate.pdf",
//     },
//   });
// };

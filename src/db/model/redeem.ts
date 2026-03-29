import type { BrowserWorker } from "@cloudflare/puppeteer";
import puppeteer from "@cloudflare/puppeteer";

export const getCertificatePdf = async (
  browser: BrowserWorker,
  kv: KVNamespace,
  cacheKvKey: string,
  origin: string,
  name: string,
  certId: number,
  token: string,
) => {
  // const existing = await kv.get(cacheKvKey, "arrayBuffer");

  // if (existing) {
  //   return new Uint8Array(existing);
  // }

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
  certificateEndpoint.searchParams.set("certId", `${certId}`);
  certificateEndpoint.searchParams.set("token", token);

  console.log("goto");
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

  console.log("after close");
  const uint8 = new Uint8Array(pdf);

  // save to kv
  await kv.put(cacheKvKey, uint8);

  return uint8;
};

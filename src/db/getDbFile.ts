import path from "node:path";
import fs from "node:fs";

export function getLocalD1DB() {
  try {
    const basePath = path.resolve(".wrangler");
    const dbFile = fs
      .readdirSync(basePath, { encoding: "utf-8", recursive: true })
      .find((f) => f.endsWith(".sqlite"));

    if (!dbFile) {
      console.log(`bruh run wrangler mi`)
      throw new Error(`.sqlite file not found in ${basePath}`);
    }

    const url = path.resolve(basePath, dbFile);
    return `file:${url}`;
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error  ${err.message}`);
    } else {
      console.error(err);
    }
    throw err;
  }
}

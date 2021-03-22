import { launch, setupMetamask } from "@nodefactory/dappeteer";
import * as fs from "fs";
import http from "http";
import mkdirp from "mkdirp";
import path from "path";
import puppeteer from "puppeteer";
import handler from "serve-handler";
import { DIR } from "./constants";

/**
 * To allow environment to be typescript file
 */

export let server: http.Server;

// eslint-disable-next-line import/no-default-export
export default async function (): Promise<void> {
  console.log("\n");
  server = http.createServer((request, response) => {
    return handler(request, response, {
      public: path.join(__dirname, "../..", "build"),
    });
  });

  await new Promise<void>((resolve) => {
    server.listen(3000, async () => {
      console.log("Running at http://localhost:3000");
      resolve();
    });
  });

  const browser = await launch(puppeteer);

  try {
    await setupMetamask(browser);
    global.browser = browser;
  } catch (error) {
    console.log(error);
    throw error;
  }

  mkdirp.sync(DIR);
  fs.writeFileSync(path.join(DIR, "wsEndpoint"), browser.wsEndpoint());
}

import puppeteer from "puppeteer";
import dappeteer from "@nodefactory/dappeteer";

const MNEMONIC =
  "dust dune horn excuse armed brother gauge wealth toward silent permit cave";

describe("Test ", () => {
  it("First ", async () => {
    const browser = await dappeteer.launch(puppeteer);
    const metamask = await dappeteer.setupMetamask(browser);

    const t = await global.page.waitForSelector("#deploy-contract", {
      visible: true,
    });

    await t.click();

    await metamask.importAccount(MNEMONIC);
    await metamask.switchNetwork("rinkeby");

    // await global.metamask.approve();

    await metamask.confirmTransaction();
    await global.page.waitForSelector("#storage-value", { visible: true });
  });
});

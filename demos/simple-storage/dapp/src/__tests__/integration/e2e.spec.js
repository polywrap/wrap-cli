const dappeteer = require("@nodefactory/dappeteer");
const puppeteer = require("puppeteer");

describe("Web3API Demo Integration test ", () => {
  jest.setTimeout(60000);

  const { launch, setupMetamask, getMetamaskWindow } = dappeteer;

  beforeAll(async () => {
    try {
      const browserWithoutMetamask = await launch(puppeteer);
      await setupMetamask(browserWithoutMetamask);

      const wsEndpoint = browserWithoutMetamask.wsEndpoint();

      const browser = await puppeteer.connect({
        browserWSEndpoint: wsEndpoint,
      });

      global.browser = browser;
      global.metamask = await getMetamaskWindow(browser);
      global.page = await browserWithoutMetamask.newPage();

      await page.goto("http://localhost:3000", {
        waitUntil: "domcontentloaded",
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  });

  it("Opens metamask popup to sign transaction when click on button ", async () => {
    const deployContractButton = await global.page.waitForSelector(
      "#deploy-contract",
      {
        visible: true,
      }
    );
    await deployContractButton.click();
    await global.metamask.switchNetwork("rinkeby");
    await global.metamask.approve();

    expect(true).toBe(true);
  });

  afterAll(async () => {
    await global.browser.close();
  });
});

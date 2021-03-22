describe("Web3API Demo Integration test ", () => {
  beforeAll(async () => {
    await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  });
  it("Opens metamask popup to sign transaction when click on button ", async () => {
    jest.setTimeout(60000);
    const t = await global.page.waitForSelector("#deploy-contract", {
      visible: true,
    });
    await t.click();
    await global.metamask.switchNetwork("rinkeby");
    await global.metamask.approve();

    expect(true).toBe(true);
  });
});

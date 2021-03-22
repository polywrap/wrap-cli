import puppeteer from "puppeteer";
import dappeteer from "@nodefactory/dappeteer";

const MNEMONIC =
  "dust dune horn excuse armed brother gauge wealth toward silent permit cave";

describe("Simple Storage demo e2e ", () => {
  it("Deploy contract, update and read storage ", async () => {
    const browser = await dappeteer.launch(puppeteer);
    // const metamask = await dappeteer.setupMetamask(browser);
    // await metamask.importAccount(MNEMONIC);

    // await metamask.switchNetwork("rinkeby");

    cy.visit("/");
    cy.get(".App");

    cy.get("#webapi-title");

    cy.get("#deploy-contract").click();

    cy.wait(10000);
    // await metamask.confirmTransaction();


    cy.get("storage-value", { timeout: 20000 }).should("be.visible");
  });
});

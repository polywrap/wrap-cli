import Web3 from "web3";
import PrivateKeyProvider from "truffle-privatekey-provider";

describe("First", () => {
  // never send real ether to this, obviously
  const PRIVATE_KEY_TEST_NEVER_USE =
    "0xad20c82497421e9784f18460ad2fe84f73569068e98e270b3e63743268af5763";

  it("loads app", () => {
    cy.on("window:before:load", (win) => {
      const provider = new PrivateKeyProvider(
        PRIVATE_KEY_TEST_NEVER_USE,
        "https://eth-rinkeby.alchemyapi.io/v2/9MSOxxm5jGkqNPS1BKKYaS0NVW0UD8UZ"
      );
      win.ethereum = new Web3(provider);
    });

    cy.visit("/");
    cy.get(".App");

    cy.get("#webapi-title");
    cy.get("#deploy-contract").click();
    cy.get("storage-value", { timeout: 20000 }).should("be.visible");
  });
});

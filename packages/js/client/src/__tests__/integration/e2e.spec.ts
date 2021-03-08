/* eslint-disable cypress/no-unnecessary-waiting */
/* eslint-disable ui-testing/no-hard-wait */
describe("First", () => {
  it("loads app", () => {
    cy.visit("/");
    cy.get(".App");

    cy.get("#webapi-title");

    cy.get("#deploy-contract").click();

    cy.wait(10000);
    cy.acceptMetamaskAccess();

    cy.wait(10000);

    cy.confirmMetamaskTransaction();

    cy.get("storage-value", { timeout: 20000 }).should("be.visible");
  });
});

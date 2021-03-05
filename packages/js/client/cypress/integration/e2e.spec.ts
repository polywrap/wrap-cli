describe("First", () => {
  it("loads app", () => {
    cy.visit("/");
    cy.get(".App");
  });
});

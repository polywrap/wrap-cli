module.exports = {
  ...require("./jest.config"),
  testMatch: ["**/wasm-rs.spec.ts"],
  modulePathIgnorePatterns: [],
};

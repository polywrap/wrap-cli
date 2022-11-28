module.exports = {
  ...require("./jest.config"),
  testMatch: ["**/wasm-go.spec.ts"],
  modulePathIgnorePatterns: [],
};

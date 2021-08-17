module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ["**/src/*/index.ts"],
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/?(*.)+(spec|test).[jt]s?(x)"]
};

module.exports = {
  collectCoverage: true,
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/?(*.)+(spec|test).[jt]s?(x)"],
  modulePathIgnorePatterns: ["./src/__tests__/query", "./src/__tests__/utils"],
};

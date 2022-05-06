module.exports = {
  collectCoverage: false,
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/e2e/**/?(*.)+(spec|test).[jt]s?(x)"],
  modulePathIgnorePatterns: [
    "./src/__tests__/mutation",
    "./src/__tests__/query",
    "./src/__tests__/utils",
  ],
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
      diagnostics: false,
    },
  },
};

module.exports = {
  collectCoverage: false,
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/e2e/**/?(*.)+(spec|test).[jt]s?(x)"],
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
      diagnostics: false,
    },
  },
};

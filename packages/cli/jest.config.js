module.exports = {
  collectCoverage: true,
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/?(*.)+(spec|test).[jt]s?(x)"],
  globals: {
    "ts-jest": {
      diagnostics: false
    },
  },
  modulePathIgnorePatterns: [
    "<rootDir>/build",
    "<rootDir>/src/__tests__/project/.polywrap",
    "<rootDir>/src/__tests__/e2e/build-rs.spec.ts",
    "<rootDir>/src/__tests__/e2e/build-go.spec.ts"
  ],
  testPathIgnorePatterns: [
    "<rootDir>/src/__tests__/project/.polywrap"
  ],
  transformIgnorePatterns: [
    "<rootDir>/src/__tests__/project/.polywrap"
  ],
  setupFilesAfterEnv: ["./jest.setup.js"],
};

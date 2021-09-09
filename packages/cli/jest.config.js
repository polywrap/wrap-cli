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
    "<rootDir>/src/__tests__/project"
  ],
  testPathIgnorePatterns: [
    "<rootDir>/src/__tests__/project"
  ],
  transformIgnorePatterns: [
    "<rootDir>/src/__tests__/project"
  ],
  setupFilesAfterEnv: ["./jest.setup.js"],
};

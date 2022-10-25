module.exports = {
  roots: ["<rootDir>/src"],
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  modulePathIgnorePatterns: ["<rootDir>/src/__tests__/e2e/integration/"],
  testPathIgnorePatterns: ["<rootDir>/src/__tests__/e2e/integration/"],
  transformIgnorePatterns: ["<rootDir>/src/__tests__/e2e/integration/"],
  testEnvironment: "node",
};

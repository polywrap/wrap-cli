module.exports = {
  globals: {
    URL: "http://localhost:3000",
  },
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  globalSetup: "./src/__tests__/setup.ts",
  globalTeardown: "./src/__tests__/teardown.ts",
  testEnvironment: "./src/__tests__/environment.js",
  testMatch: ["**/?(*).spec.js"],
};

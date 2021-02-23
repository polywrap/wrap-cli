module.exports = {
  collectCoverage: true,
  preset: "ts-jest",
  testMatch: ["**/?(*.)+(spec|test).tsx"],
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup.js"],
  globals: {
    "ts-jest": {
      diagnostics: false,
    },
  },
};

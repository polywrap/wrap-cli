module.exports = {
  collectCoverage: true,
  preset: "ts-jest",
  testMatch: ["**/?(*.)+(spec|test).tsx"],
  globals: {
    "ts-jest": {
      diagnostics: false,
    },
  },
};

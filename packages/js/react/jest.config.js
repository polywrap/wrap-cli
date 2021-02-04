module.exports = {
  collectCoverage: true,
  preset: "ts-jest",
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
  globals: {
    "ts-jest": {
      diagnostics: false,
    },
  },
};

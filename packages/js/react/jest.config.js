module.exports = {
  collectCoverage: true,
  preset: "ts-jest",
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
  modulePathIgnorePatterns: ['./src/__tests__/simple-storage-api'],
  globals: {
    "ts-jest": {
      diagnostics: false,
    },
  },
};

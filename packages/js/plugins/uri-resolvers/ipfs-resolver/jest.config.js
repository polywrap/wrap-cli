module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
  modulePathIgnorePatterns: [],
  roots: ["./src/__tests__"],
  globals: {
    "ts-jest": {
      diagnostics: false,
    },
  },
};

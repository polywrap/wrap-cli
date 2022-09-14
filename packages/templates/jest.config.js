module.exports = {
  collectCoverage: true,
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/tests.spec.ts"],
  globals: {
    "ts-jest": {
      diagnostics: false
    },
  },
};

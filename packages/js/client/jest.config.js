module.exports = {
  collectCoverage: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
  modulePathIgnorePatterns: ["\\./src/__tests__/e2e/wasm-rs\\.spec\\.ts", "\\.polywrap"],
  globals: {
    'ts-jest': {
      diagnostics: false
    }
  }
};

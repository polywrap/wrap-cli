module.exports = {
  "roots": [
    "<rootDir>/src"
  ],
  "testMatch": [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)"
  ],
  "transform": {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  modulePathIgnorePatterns: [
    "<rootDir>/src/__tests__/e2e/integration/"
  ],
  testPathIgnorePatterns: [
    "<rootDir>/src/__tests__/e2e/integration/"
  ],
  transformIgnorePatterns: [
    "<rootDir>/src/__tests__/e2e/integration/"
  ],
  testEnvironment: 'node'
}

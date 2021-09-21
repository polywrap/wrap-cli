module.exports = {
  "roots": [
    "<rootDir>/src"
  ],
  "testMatch": [
    "**/?(*.)+(spec|test).+(ts|tsx|js)"
  ],
  "transform": {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  modulePathIgnorePatterns: [
    "<rootDir>/src/__tests__/integration"
  ],
  testPathIgnorePatterns: [
    "<rootDir>/src/__tests__/integration"
  ],
  transformIgnorePatterns: [
    "<rootDir>/src/__tests__/integration"
  ],
  testEnvironment: 'node'
}

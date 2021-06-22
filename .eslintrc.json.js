module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
    mocha: true
  },
  parserOptions: {
    "ecmaVersion": 2019
  },
  ignorePatterns: ["**/w3/**/*.*", "**/__tests__/**/*.*", "**/node_modules/**/*.*"],
  extends: [
    "plugin:json/recommended"
  ],
};
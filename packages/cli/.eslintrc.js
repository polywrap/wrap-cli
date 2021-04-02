module.exports = {
  plugins: [
    "formatjs"
  ],
  rules: {
    "formatjs/enforce-default-message": ["error", "literal"],
    "formatjs/enforce-placeholders": "error",
    "formatjs/no-camel-case": "warn",
    "formatjs/no-emoji": "warn",
    "formatjs/no-multiple-whitespaces": "warn",
    "formatjs/no-multiple-plurals": "warn",
    "formatjs/no-offset": "warn",
    "formatjs/enforce-id": ["off", { "idInterpolationPattern": "[sha512:contenthash:base64:6]" }]
  }
};
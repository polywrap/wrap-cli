
module.exports = {
  extends: "../../../.eslintrc.js",
  overrides: [
    {
      files: ["*.ts"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: ["tsconfig.json"],
      },
      plugins: [
        "eslint-plugin-import",
        "@typescript-eslint",
        "prettier"
      ],
      extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier",
      ],
      rules: {
        "import/no-extraneous-dependencies": "off",
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/naming-convention": [
          "error",
          {selector: "default", format: ["camelCase"]},
          {selector: ["classProperty", "objectLiteralProperty", "parameterProperty", "classMethod"], format: ["camelCase"], leadingUnderscore: "allow"},
          //variable must be in camel or upper case
          {selector: "variable", format: ["camelCase", "UPPER_CASE"], leadingUnderscore: "allow"},
          //classes and types must be in PascalCase
          {selector: ["typeLike", "enum"], format: ["PascalCase"]},
          {selector: ["parameter"], format: ["snake_case"], leadingUnderscore: "allow"},
          {selector: "enumMember", format: null},
          {selector: "function", format: null, leadingUnderscore: "allowSingleOrDouble"},
        ]
      },
    },
  ],
};

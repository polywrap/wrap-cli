
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
        "prettier/prettier": ["error"],
        "@typescript-eslint/naming-convention": [
          "error",
          {selector: "default", format: ["camelCase"]},
          {
            selector: [
              "classProperty", "parameterProperty",
              "classMethod", "parameter"
            ],
            format: ["camelCase"],
            leadingUnderscore: "allow"
          },
          //wrapper host methods doesn"t satisfy neither camel or snake
          {selector: ["objectLiteralMethod", "typeMethod"], filter: {regex: "^_wrap_.*", match: true}, format: null},
          //variable must be in camel or upper case
          {selector: "variable", format: ["camelCase", "PascalCase", "UPPER_CASE"], leadingUnderscore: "allow"},
          //classes and types must be in PascalCase
          {selector: ["typeLike", "enum"], format: ["PascalCase"]},
          {selector: "enumMember", format: null},
          //ignore rule for quoted stuff
          {
            selector: [
              "classProperty",
              "objectLiteralProperty",
              "typeProperty",
              "classMethod",
              "objectLiteralMethod",
              "typeMethod",
              "accessor",
              "enumMember"
            ],
            format: null,
            modifiers: ["requiresQuotes"]
          },
          //ignore rules on destructured params
          {
            selector: "variable",
            modifiers: ["destructured"],
            format: null
          },
          {
            selector: [
              "objectLiteralProperty",
              "objectLiteralMethod",
            ],
            format: ["PascalCase", "camelCase"]
          },
        ],
        "@typescript-eslint/explicit-module-boundary-types": "error",
        "@typescript-eslint/member-ordering": "error",
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/no-require-imports": "error",
        "@typescript-eslint/no-unused-vars": ["error", {
          "varsIgnorePattern": "^_",
          "argsIgnorePattern": "^_",
        }],
        "@typescript-eslint/no-floating-promises": "error",
        "import/no-extraneous-dependencies": ["error", {
          "devDependencies": false,
          "optionalDependencies": true,
          "peerDependencies": false
        }],
        "import/order": [
          "error",
          {
            "groups": [["index", "sibling", "parent", "internal"], ["external", "builtin"], "object"],
            "newlines-between": "always"
          }
        ],
      },
    },
  ],
};

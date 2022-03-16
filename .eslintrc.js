module.exports = {
  root: true,
  ignorePatterns: [
    "**/w3/**/*.*",
    "**/build/**/*.*",
    "**/__tests__/**/*.*",
    "**/node_modules/**/*.*",
    "**/coverage/**/*.*"
  ],
  overrides: [
    {
      files: ["*.ts"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: ["tsconfig.json", "./packages/**/tsconfig.json"],
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
        "plugin:json/recommended"
      ],
      rules: {
        "prettier/prettier": ["error"],
        "spaced-comment": ["error", "always", { "markers": ["/"] }],
        "@typescript-eslint/naming-convention": [
          "error",
          {selector: "default", format: ["camelCase"]},
          {
            selector: [
              "classProperty", "parameterProperty", "objectLiteralProperty",
              "classMethod", "parameter"
            ],
            format: ["camelCase"], leadingUnderscore: "allow"
          },
          //web3 api host methods doesn"t satisfy neither camel or snake
          {selector: ["objectLiteralMethod", "typeMethod"], filter: {regex: "^_w3_.*", match: true}, format: null},
          //variable must be in camel or upper case
          {selector: "variable", format: ["camelCase", "UPPER_CASE"], leadingUnderscore: "allow"},
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
          }
        ],
        "@typescript-eslint/explicit-module-boundary-types": "error",
        "@typescript-eslint/member-ordering": [
          "error", {
            classes: {
              order: "as-written",
              memberTypes: [
                // Constructors
                "public-constructor",
                "protected-constructor",
                "private-constructor",

                // Methods
                "public-static-method",
                "public-abstract-method",
                "public-instance-method",
                "public-decorated-method",
                "protected-static-method",
                "protected-abstract-method",
                "protected-instance-method",
                "protected-decorated-method",
                "private-static-method",
                "private-abstract-method",
                "private-instance-method",
                "private-decorated-method",
              ],
            },
          },
        ],
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
        ]
      },
    },
    {
      files: ["**/__tests__/**/*.ts", "*.spec.ts"],
      rules: {
        "import/no-extraneous-dependencies": "off"
      }
    },
    {
      files: ["*.d.ts"],
      rules: {
        "@typescript-eslint/triple-slash-reference": "off"
      }
    },
    {
      files: ["*.json"],
      extends: ["plugin:json/recommended"],
    },
    {
      files: ["*.graphql"],
      plugins: ["@graphql-eslint"],
      parser: "@graphql-eslint/eslint-plugin",
      rules: {
        "function-call-argument-newline": ["error"],
        "@graphql-eslint/avoid-typename-prefix": ["warn"],
        "@graphql-eslint/no-hashtag-description": ["off"],
        "@graphql-eslint/require-deprecation-reason": ["error"],
        "@graphql-eslint/no-case-insensitive-enum-values-duplicates": ["error"],
        "@graphql-eslint/description-style": ["warn", {"style":"inline"}],
        "@graphql-eslint/avoid-duplicate-fields": ["error"],
        "@graphql-eslint/naming-convention": ["error",
          {
            "FieldDefinition":"camelCase",
            "InputObjectTypeDefinition":"PascalCase",
            "EnumValueDefinition":"UPPER_CASE",
            "InputValueDefinition":"camelCase",
            "ObjectTypeDefinition":"PascalCase",
            "InterfaceTypeDefinition":"PascalCase",
            "EnumTypeDefinition":"PascalCase",
            "UnionTypeDefinition":"PascalCase",
            "ScalarTypeDefinition":"PascalCase",
            "OperationDefinition":"PascalCase",
            "FragmentDefinition":"PascalCase",
            "QueryDefinition":"camelCase",
            "leadingUnderscore":"forbid",
            "trailingUnderscore":"forbid"
          }],
        "@graphql-eslint/possible-type-extension": ["error"],
        "@graphql-eslint/unique-operation-name": ["error"],
        "@graphql-eslint/unique-directive-names": ["error"],
        "@graphql-eslint/unique-enum-value-names": ["error"],
        "@graphql-eslint/unique-field-definition-names": ["error"],
        "@graphql-eslint/unique-input-field-names": ["error"],
        "@graphql-eslint/unique-type-names": ["error"],
      }
    }
  ]
};

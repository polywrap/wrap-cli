module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
    mocha: true
  },
  ignorePatterns: ["**/w3/**/*.ts", "**/__tests__/**/*.*"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "es2019",
    tsconfigRootDir: __dirname,
    project: ['./packages/**/tsconfig.json'],
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
    "prettier"
  ],
  rules: {
    "prettier/prettier": ["error"],
    "@typescript-eslint/naming-convention": ["error",
      {selector: "default", format: ['camelCase']},
      {
        selector: [
          "classProperty", "parameterProperty", "objectLiteralProperty",
          "classMethod", "parameter"
        ],
        format: ['camelCase'], leadingUnderscore: "allow"
      },
      //web3 api host methods doesn't satisfy neither camel or snake
      {selector: ["objectLiteralMethod", "typeMethod"], filter: {regex: "^_w3_.*", match: true}, format: null},
      //variable must be in camel or upper case
      {selector: "variable", format: ["camelCase", "UPPER_CASE"], leadingUnderscore: "allow"},
      //classes and types must be in PascalCase
      {selector: ["typeLike", "enum"], format: ['PascalCase']},
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
    ]
  },
  overrides: [
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
      files: ["*.graphql"],
      parser: "@graphql-eslint/eslint-plugin",
      plugins: ["@graphql-eslint"],
      parserOptions: {
        schema: ["./src/**/*.graphql"],
        operations: ["./src/**/*.graphql"],
      },
      rules: {
        "prettier/prettier": [2, {parser: "graphql"}],
        "@graphql-eslint/avoid-typename-prefix": ["warn"],
        "@graphql-eslint/no-unused-fields": ["warn"],
        "@graphql-eslint/no-deprecated": ["warn"],
        "@graphql-eslint/no-hashtag-description": ["error"],
        "@graphql-eslint/require-deprecation-reason": ["error"],
        "@graphql-eslint/no-case-insensitive-enum-values-duplicates": ["error"],
        "@graphql-eslint/description-style": ["error", {"style":"inline"}],
        "@graphql-eslint/avoid-duplicate-fields": ["error"],
        "@graphql-eslint/naming-convention": ["error",
          {
            "FieldDefinition":"camelCase",
            "InputObjectTypeDefinition":"PascalCase",
            "EnumValueDefinition":"camelCase",
            "InputValueDefinition":"camelCase",
            "ObjectTypeDefinition":"PascalCase",
            "InterfaceTypeDefinition":"PascalCase",
            "EnumTypeDefinition":"PascalCase",
            "UnionTypeDefinition":"PascalCase",
            "ScalarTypeDefinition":"PascalCase",
            "OperationDefinition":"PascalCase",
            "FragmentDefinition":"PascalCase",
            "QueryDefinition":"PascalCase",
            "leadingUnderscore":"forbid",
            "trailingUnderscore":"forbid"
          }],
        "@graphql-eslint/known-argument-names": ["error"],
        "@graphql-eslint/known-directives": ["warn"],
        "@graphql-eslint/known-type-names": ["error"],
        "@graphql-eslint/known-fragment-names": ["warn"],
        "@graphql-eslint/no-fragment-cycles": ["warn"],
        "@graphql-eslint/no-undefined-variables": ["warn"],
        "@graphql-eslint/no-unused-fragments": ["warn"],
        "@graphql-eslint/no-unused-variables": ["warn"],
        "@graphql-eslint/overlapping-fields-can-be-merged": ["warn"],
        "@graphql-eslint/possible-fragment-spread": ["warn"],
        "@graphql-eslint/possible-type-extension": ["error"],
        "@graphql-eslint/provided-required-arguments": ["warn"],
        "@graphql-eslint/scalar-leafs": ["warn"],
        "@graphql-eslint/one-field-subscriptions": ["warn"],
        "@graphql-eslint/unique-argument-names": ["error"],
        "@graphql-eslint/unique-directive-names": ["warn"],
        "@graphql-eslint/unique-directive-names-per-location": ["error"],
        "@graphql-eslint/unique-enum-value-names": ["error"],
        "@graphql-eslint/unique-field-definition-names": ["error"],
        "@graphql-eslint/unique-input-field-names": ["error"],
        "@graphql-eslint/unique-type-names": ["error"],
        "@graphql-eslint/unique-variable-names": ["error"],
        "@graphql-eslint/value-literals-of-correct-type": ["warn"],
        "@graphql-eslint/variables-are-input-types": ["warn"],
        "@graphql-eslint/variables-in-allowed-position": ["warn"]
      },
    },
    {
      files: ['*.js/*.graphql'],
      rules: {
        'prettier/prettier': 0
      }
    },
  ]
};
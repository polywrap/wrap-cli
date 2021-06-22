module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  ignorePatterns: ["**/w3/**/*.*", "**/__tests__/**/*.*", "**/node_modules/**/*.*"],
  parser: "@graphql-eslint/eslint-plugin",
  plugins: [
    "prettier",
    "@graphql-eslint"
  ],
  extends: [
    "prettier",
  ],
  rules: {
    "prettier/prettier": ["error", {parser: "graphql"}],
    "@graphql-eslint/avoid-typename-prefix": ["warn"],
    "@graphql-eslint/no-hashtag-description": ["warn"],
    "@graphql-eslint/require-deprecation-reason": ["error"],
    "@graphql-eslint/no-case-insensitive-enum-values-duplicates": ["error"],
    "@graphql-eslint/description-style": ["warn", {"style":"inline"}],
    "@graphql-eslint/avoid-duplicate-fields": ["error"],
    "@graphql-eslint/naming-convention": ["off",
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
        "QueryDefinition":"PascalCase",
        "leadingUnderscore":"forbid",
        "trailingUnderscore":"forbid"
      }],
    "@graphql-eslint/possible-type-extension": ["error"],
    "@graphql-eslint/unique-directive-names": ["error"],
    "@graphql-eslint/unique-enum-value-names": ["error"],
    "@graphql-eslint/unique-field-definition-names": ["error"],
    "@graphql-eslint/unique-input-field-names": ["error"],
    "@graphql-eslint/unique-type-names": ["error"],
  }
};

module.exports = {
  "rules": {
    "import/no-extraneous-dependencies": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-inferrable-types": "off",
    "@typescript-eslint/member-ordering": "off",
    "@typescript-eslint/naming-convention": ["error",
    {selector: "default", format: ['camelCase']},
    {selector: ["objectLiteralProperty", "parameterProperty", "classMethod"], format: ['camelCase'], leadingUnderscore: "allow"},
    //variable must be in camel or upper case
    {selector: ["classProperty", "variable"], format: ["camelCase", "UPPER_CASE"], leadingUnderscore: "allow"},
    //classes and types must be in PascalCase
    {selector: ["typeLike", "enum"], format: ['PascalCase']},
    {selector: ["parameter"], format: ['snake_case', "camelCase"], leadingUnderscore: "allow"},
    {selector: "enumMember", format: null},
    {selector: "function", format: null, leadingUnderscore: "allowSingleOrDouble"},
  ]}
};
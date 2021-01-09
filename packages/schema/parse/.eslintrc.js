
module.exports = {
  "rules": {
    "import/no-extraneous-dependencies": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/naming-convention": ["error", 
    {selector:  ["objectLiteralProperty", "objectLiteralMethod"], format: ['PascalCase', 'camelCase']},
  ]}
};
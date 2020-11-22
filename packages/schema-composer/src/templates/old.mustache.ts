const template =
`directive @imported(
  namespace: String!
  uri: String!
  type: String!
) on OBJECT

directive @imports (
  types: [String!]!
)

type {{qualifiedName}} @imported(
  namespace: "{{namespace}}",
  type: "{{name}}",
  uri: "{{source}}"
) {
  {{contents}}
}

type {{name}} @imports(
  types: [ {{#importedTypes}}"{{.}}"{{/importedTypes}} ]
) {
 {{contents}}
}
`;

export { template };

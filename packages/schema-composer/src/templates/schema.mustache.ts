const template =
`
{{schema}}

{{#typeInfo}}
{{#importedQueryTypes}}
type {{namespace}}_{{name}} @imported(
  namespace: "{{namespace}}",
  uri: "{{uri}}",
  type: "{{name}}"
) {
  {{#methods}}
  {{name}}(
    {{#arguments}}
    {{name}}: {{#toGraphQL}}{{type}}{{/toGraphQL}}
    {{/arguments}}
  ): {{#return}}{{#toGraphQL}}{{type}}{{/toGraphQL}}{{/return}}
  {{/methods}}
}

{{/importedQueryTypes}}
{{#importedObjectTypes}}
type {{namespace}}_{{name}} @imported(
  namespace: "{{namespace}}",
  uri: "{{uri}}",
  type: "{{name}}"
) {
  {{#properties}}
  {{name}}: {{#toGraphQL}}{{type}}{{/toGraphQL}}
  {{/properties}}
}

{{/importedObjectTypes}}
{{/typeInfo}}
`;

export { template };

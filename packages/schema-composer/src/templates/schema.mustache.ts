const template: string =
`{{schema}}
{{#typeInfo}}
{{#userTypes}}
type {{name}} {
  {{#properties}}
  {{name}}: {{#toGraphQL}}{{type}}{{/toGraphQL}}
  {{/properties}}
}

{{/userTypes}}
### Imported Queries START ###

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
  {{^last}}

  {{/last}}
  {{/methods}}
}

{{/importedQueryTypes}}
### Imported Queries END ###

### Imported Objects START ###

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
### Imported Objects END ###{{/typeInfo}}`;

export { template };

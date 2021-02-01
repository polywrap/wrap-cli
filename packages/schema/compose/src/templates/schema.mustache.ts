const template = `{{schema}}
{{#typeInfo}}
{{#objectTypes}}
type {{type}} {
  {{#properties}}
  {{name}}: {{toGraphQLType}}
  {{/properties}}
}

{{/objectTypes}}
### Imported Queries START ###

{{#importedQueryTypes}}
type {{type}} @imported(
  namespace: "{{namespace}}",
  uri: "{{uri}}",
  type: "{{nativeType}}"
) {
  {{#methods}}
  {{name}}(
    {{#arguments}}
    {{name}}: {{toGraphQLType}}
    {{/arguments}}
  ): {{#return}}{{toGraphQLType}}{{/return}}
  {{^last}}

  {{/last}}
  {{/methods}}
}

{{/importedQueryTypes}}
### Imported Queries END ###

### Imported Objects START ###

{{#importedObjectTypes}}
type {{type}} @imported(
  namespace: "{{namespace}}",
  uri: "{{uri}}",
  type: "{{nativeType}}"
) {
  {{#properties}}
  {{name}}: {{toGraphQLType}}
  {{/properties}}
}

{{/importedObjectTypes}}
### Imported Objects END ###{{/typeInfo}}`;

export { template };

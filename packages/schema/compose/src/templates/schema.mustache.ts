const template = `{{schema}}
{{#typeInfo}}
{{#objectTypes}}
type {{type}} {
  {{#properties}}
  {{name}}: {{toGraphQLType}}
  {{/properties}}
}

{{/objectTypes}}
{{#enumTypes}}
enum {{type}} {
  {{#constants}}
  {{.}}
  {{/constants}}
}

{{/enumTypes}}
### Imported Queries START ###

{{#importedQueryTypes}}
type {{type}} @imported(
  uri: "{{uri}}",
  namespace: "{{namespace}}",
  nativeType: "{{nativeType}}"
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
  uri: "{{uri}}",
  namespace: "{{namespace}}",
  nativeType: "{{nativeType}}"
) {
  {{#properties}}
  {{name}}: {{toGraphQLType}}
  {{/properties}}
}

{{/importedObjectTypes}}

{{#importedEnumTypes}}
enum {{type}} @imported(
  namespace: "{{namespace}}",
  uri: "{{uri}}",
  type: "{{nativeType}}"
) {
  {{#constants}}
  {{.}}
  {{/constants}}
}

{{/importedEnumTypes}}
### Imported Objects END ###{{/typeInfo}}`;

export { template };

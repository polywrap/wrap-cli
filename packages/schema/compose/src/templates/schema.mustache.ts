const template = `
{{#typeInfo}}
{{#queryTypes}}
type {{type}}{{#interfaces.length}} implements{{#interfaces}} {{type}}{{^last}} &{{/last}}{{/interfaces}}{{/interfaces.length}}{{#imports.length}} @imports(
  types: [
    {{#imports}}
    "{{type}}"{{^last}},{{/last}}
    {{/imports}}
  ]
){{/imports.length}} {
  {{#methods}}
  {{name}}{{#arguments.length}}(
    {{#arguments}}
    {{name}}: {{toGraphQLType}}
    {{/arguments}}
  ){{/arguments.length}}: {{#return}}{{toGraphQLType}}{{/return}}
  {{^last}}

  {{/last}}
  {{/methods}}
}

{{/queryTypes}}
{{#objectTypes}}
type {{type}}{{#interfaces.length}} implements{{#interfaces}} {{type}}{{^last}} &{{/last}}{{/interfaces}}{{/interfaces.length}} {
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
type {{type}}{{#interfaces.length}} implements{{#interfaces}} {{type}}{{^last}} &{{/last}}{{/interfaces}}{{/interfaces.length}} @imported(
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
type {{type}}{{#interfaces.length}} implements{{#interfaces}} {{type}}{{^last}} &{{/last}}{{/interfaces}}{{/interfaces.length}} @imported(
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
  nativeType: "{{nativeType}}"
) {
  {{#constants}}
  {{.}}
  {{/constants}}
}

{{/importedEnumTypes}}
### Imported Objects END ###{{/typeInfo}}`;

export { template };

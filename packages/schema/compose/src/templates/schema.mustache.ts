const template = `
{{#typeInfo}}
{{#queryTypes}}{{#comment}}
"""
{{comment}}
"""
{{/comment}}
type {{type}}{{#interfaces.length}} implements{{#interfaces}} {{type}}{{^last}} &{{/last}}{{/interfaces}}{{/interfaces.length}}{{#imports.length}} @imports(
  types: [
    {{#imports}}
    "{{type}}"{{^last}},{{/last}}
    {{/imports}}
  ]
){{/imports.length}} {
  {{#methods}}{{#comment}}
"""
{{comment}}
"""
{{/comment}}
  {{name}}{{#arguments.length}}(
    {{#arguments}}{{#comment}}
"""
{{comment}}
"""
{{/comment}}
    {{name}}: {{toGraphQLType}}
    {{/arguments}}
  ){{/arguments.length}}: {{#return}}{{toGraphQLType}}{{/return}}
  {{^last}}

  {{/last}}
  {{/methods}}
}

{{/queryTypes}}
{{#objectTypes}}{{#comment}}
"""
{{comment}}
"""
{{/comment}}
type {{type}}{{#interfaces.length}} implements{{#interfaces}} {{type}}{{^last}} &{{/last}}{{/interfaces}}{{/interfaces.length}} {
  {{#properties}}{{#comment}}
"""
{{comment}}
"""
{{/comment}}
  {{name}}: {{toGraphQLType}}
  {{/properties}}
}

{{/objectTypes}}
{{#enumTypes}}{{#comment}}
"""
{{comment}}
"""
{{/comment}}
enum {{type}} {
  {{#constants}}
  {{.}}
  {{/constants}}
}

{{/enumTypes}}
### Imported Queries START ###

{{#importedQueryTypes}}{{#comment}}
"""
{{comment}}
"""
{{/comment}}
type {{type}}{{#interfaces.length}} implements{{#interfaces}} {{type}}{{^last}} &{{/last}}{{/interfaces}}{{/interfaces.length}} @imported(
  uri: "{{uri}}",
  namespace: "{{namespace}}",
  nativeType: "{{nativeType}}"
) {
  {{#methods}}{{#comment}}
"""
{{comment}}
"""
{{/comment}}
  {{name}}(
    {{#arguments}}{{#comment}}
"""
{{comment}}
"""
{{/comment}}
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

{{#importedObjectTypes}}{{#comment}}
"""
{{comment}}
"""
{{/comment}}
type {{type}}{{#interfaces.length}} implements{{#interfaces}} {{type}}{{^last}} &{{/last}}{{/interfaces}}{{/interfaces.length}} @imported(
  uri: "{{uri}}",
  namespace: "{{namespace}}",
  nativeType: "{{nativeType}}"
) {
  {{#properties}}{{#comment}}
"""
{{comment}}
"""
{{/comment}}
  {{name}}: {{toGraphQLType}}
  {{/properties}}
}

{{/importedObjectTypes}}

{{#importedEnumTypes}}{{#comment}}
"""
{{comment}}
"""
{{/comment}}
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

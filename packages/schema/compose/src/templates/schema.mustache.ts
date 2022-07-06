const template = `
{{#abi}}
{{#moduleType}}{{#comment}}
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
){{/imports.length}}{{#capabilities.length}}{{#capabilities}} @capability(
  type: "{{type}}",
  uri: "{{uri}}",
  namespace: "{{namespace}}"
){{/capabilities}}{{/capabilities.length}}{{#methods.length}} {
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
  ){{/arguments.length}}: {{#return}}{{toGraphQLType}}{{/return}}{{#env}} @env(required: {{required}}){{/env}}
  {{^last}}

  {{/last}}
  {{/methods}}
}{{/methods.length}}

{{/moduleType}}
{{#envType}}{{#comment}}
"""
{{comment}}
"""
{{/comment}}
type {{type}}{{#interfaces.length}} implements{{#interfaces}} {{type}}{{^last}} &{{/last}}{{/interfaces}}{{/interfaces.length}}{{#properties.length}} {
  {{#properties}}{{#comment}}
  """
  {{comment}}
  """
  {{/comment}}
  {{name}}: {{toGraphQLType}}
  {{/properties}}
}{{/properties.length}}

{{/envType}}
{{#objectTypes}}{{#comment}}
"""
{{comment}}
"""
{{/comment}}
type {{type}}{{#interfaces.length}} implements{{#interfaces}} {{type}}{{^last}} &{{/last}}{{/interfaces}}{{/interfaces.length}}{{#properties.length}} {
  {{#properties}}{{#comment}}
  """
  {{comment}}
  """
  {{/comment}}
  {{name}}: {{toGraphQLType}}
  {{/properties}}
}{{/properties.length}}

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
### Imported Modules START ###

{{#importedModuleTypes}}{{#comment}}
"""
{{comment}}
"""
{{/comment}}
type {{type}}{{#interfaces.length}} implements{{#interfaces}} {{type}}{{^last}} &{{/last}}{{/interfaces}}{{/interfaces.length}} @imported(
  uri: "{{uri}}",
  namespace: "{{namespace}}",
  nativeType: "{{nativeType}}"
){{#isInterface}} @enabled_interface{{/isInterface}}{{#methods.length}} {
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
  ){{/arguments.length}}: {{#return}}{{toGraphQLType}}{{/return}}{{#env}} @env(required: {{required}}){{/env}}
  {{^last}}

  {{/last}}
  {{/methods}}
}{{/methods.length}}

{{/importedModuleTypes}}
### Imported Modules END ###

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
){{#properties.length}} {
  {{#properties}}{{#comment}}
  """
  {{comment}}
  """
  {{/comment}}
  {{name}}: {{toGraphQLType}}
  {{/properties}}
}{{/properties.length}}

{{/importedObjectTypes}}

{{#importedEnumTypes}}{{#comment}}
"""
{{comment}}
"""
{{/comment}}
enum {{type}} @imported(
  uri: "{{uri}}",
  namespace: "{{namespace}}",
  nativeType: "{{nativeType}}"
) {
  {{#constants}}
  {{.}}
  {{/constants}}
}

{{/importedEnumTypes}}
### Imported Objects END ###

### Imported Envs START ###

{{#importedEnvTypes}}{{#comment}}
"""
{{comment}}
"""
{{/comment}}
type {{type}}{{#interfaces.length}} implements{{#interfaces}} {{type}}{{^last}} &{{/last}}{{/interfaces}}{{/interfaces.length}} @imported(
  uri: "{{uri}}",
  namespace: "{{namespace}}",
  nativeType: "{{nativeType}}"
){{#properties.length}} {
  {{#properties}}{{#comment}}
  """
  {{comment}}
  """
  {{/comment}}
  {{name}}: {{toGraphQLType}}
  {{/properties}}
}{{/properties.length}}

{{/importedEnvTypes}}
### Imported Envs END ###{{/abi}}`;

export { template };

export function getYamlishSchemaForManifestJsonSchemaObject(
  schema: Record<string, any>,
  name = "",
  description = "",
  indent = 0
): string {
  let output = "";

  if (name.length) {
    output += `${name}:  # ${description}\n`;
  }

  for (const prop in schema) {
    if (schema[prop].type === "object") {
      output += getYamlishSchemaForManifestJsonSchemaObject(
        schema[prop].properties,
        prop,
        schema[prop].description,
        indent + 1
      );
    } else {
      output +=
        getYamlishJsonSchemaPropertyString(schema[prop], prop, indent) + "\n";
    }
  }

  return output;
}

function getYamlishJsonSchemaPropertyString(
  property: Record<string, any>,
  propName: string,
  indent = 0
) {
  let output = "";

  for (let i = 0; i < indent; i++) {
    output += "  ";
  }

  output += `${propName}:  # ${property.description}`;

  if (property.enum) {
    output += " Values: ";
    for (let j = 0; j < property.enum.length; j++) {
      output += `${property.enum[j]}`;
      if (j !== property.enum.length - 1) {
        output += ", ";
      }
    }
  }

  return output;
}

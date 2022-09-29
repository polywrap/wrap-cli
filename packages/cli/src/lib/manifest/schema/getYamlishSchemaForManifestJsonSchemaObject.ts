import { JSONSchema4 } from "json-schema";

export function getYamlishSchemaForManifestJsonSchemaObject(
  schema: JSONSchema4,
  name = "",
  description = "",
  indent = 0
): string {
  let output = "";

  if (name.length) {
    output += `${name}:  # ${description}\n`;
  }

  for (const prop in schema) {
    const schemaProperty = schema[prop];

    if (schemaProperty.type === "object") {
      output += getYamlishSchemaForManifestJsonSchemaObject(
        schemaProperty.properties,
        prop,
        schemaProperty.description,
        indent + 1
      );
    } else {
      output +=
        getYamlishJsonSchemaPropertyString(schemaProperty, prop, indent) + "\n";
    }
  }

  return output;
}

function getYamlishJsonSchemaPropertyString(
  property: JSONSchema4,
  propName: string,
  indent = 0
) {
  let output = "";

  for (let i = 0; i < indent; i++) {
    output += "  ";
  }

  output += `${propName}:  # ${property.description}`;

  const propEnum = property.enum;

  if (propEnum) {
    output += " Values: ";
    for (let j = 0; j < propEnum.length; j++) {
      output += `${propEnum[j]}`;
      if (j !== propEnum.length - 1) {
        output += ", ";
      }
    }
  }

  return output;
}

import { Validator } from "jsonschema";

const ManifestSchema = {
  id: "/Web3APISchema",
  type: "object",
  properties: {
    description: {
      type: "string",
    },
    repository: {
      type: "string",
    },
    version: {
      type: "string",
    },
    query: {
      $ref: "/ModuleSchema",
    },
    mutation: {
      $ref: "/ModuleSchema",
    },
    subgraph: {
      type: "object",
      properties: {
        file: {
          type: "string",
          required: true,
        },
        id: {
          type: "string",
        },
      },
    },
  },
  required: ["version"],
  additionalProperties: false,
};

const ModuleSchema = {
  id: "/ModuleSchema",
  type: "object",
  properties: {
    schema: {
      type: ["string", "object"],
      properties: {
        file: {
          type: "string",
          required: true,
        },
      },
    },
    module: {
      type: ["string", "object"],
      properties: {
        file: {
          type: "string",
          required: true,
        },
        language: {
          type: "string",
        },
      },
    },
  },
};

export const manifestValidation = (manifest: object) => {
  const v = new Validator();
  v.addSchema(ModuleSchema, "/ModuleSchema");
  const validation = v.validate(manifest, ManifestSchema);
  if (validation.errors.length > 0) {
    let { property, message, argument } = validation.errors[0];

    // Property is equal to: instance.subgraph.file
    // Let's make it an array
    let propertyMapping: string[] | string = property.split(".");

    // Let's remove the __instance__ word because
    // the user does not cares about it
    propertyMapping.shift();

    // If argument is an Array, it means the problem
    // is regarding some typing, if not it is a missing property
    const isTypeError = Array.isArray(argument);

    // Let's show a good looking mapping of properties for the user
    propertyMapping = propertyMapping.join(" -> ");

    const typeErrorMessage = `
    Property ${propertyMapping} has the following error: ${message}`;
    const propertyErrorMessage = `
    Manifest file error: ${message}`;

    const errorMessage = isTypeError ? typeErrorMessage : propertyErrorMessage;
    throw Error(errorMessage);
  }
  return;
};

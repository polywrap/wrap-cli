import { validate, JSONSchema4 } from "json-schema";
import { compile } from "json-schema-to-typescript";
import { writeFile } from "fs";

const ModuleSchema: JSONSchema4 = {
  properties: {
    schema: {
      type: ["string", "object"],
      required: ["file"],
      properties: {
        file: {
          type: "string",
        },
      },
      additionalProperties: false,
    },
    module: {
      type: ["string", "object"],
      required: ["file"],
      properties: {
        file: {
          type: "string",
        },
        language: {
          type: "string",
        },
      },
      additionalProperties: false,
    },
  },
  additionalProperties: false,
};

const ManifestSchema: JSONSchema4 = {
  title: "Manifest",
  type: "object",
  required: ["version"],
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
      $ref: "#/definitions/ModuleSchema",
    },
    mutation: {
      $ref: "#/definitions/ModuleSchema",
    },
    subgraph: {
      type: "object",
      required: ["file"],
      properties: {
        file: {
          type: "string",
        },
        id: {
          type: "string",
        },
      },
      additionalProperties: false,
    },
  },
  definitions: {
    ModuleSchema,
  },
  additionalProperties: false,
};

export const manifestValidation = (manifest: object) => {
  const { valid, errors } = validate(manifest, ManifestSchema);
  if (!valid) {
    let { property, message } = errors[0];

    // Property is equal to: subgraph.file or mutation.module.languange
    // Let's make it an array
    let propertyMapping: string[] | string = property.split(".");

    // Let's show a good looking mapping of properties for the user (If it's a nested property)
    propertyMapping = propertyMapping.join(" -> ");

    // @TODO: Improve error messages also, should we use the print from gluegun?
    const errorMessage = `Property ${propertyMapping} has the following error: ${message}`;
    throw Error(errorMessage);
  }

  compile(ManifestSchema, "Web3API").then((file) => {
    // @TODO: Make sure where do we want to generate this file
    writeFile('./Manifest.ts', file, (error: Error | null) => {
      if (error) throw Error(error.message)
      console.log("\nManifest type file created")
    })
  });
};

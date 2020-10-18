import { Validator } from "jsonschema";
import { Manifest } from "../Manifest";

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
        },
        id: {
          type: "string"
        }
      },
      required: ["file"],
    },
  },
  required: ["version"],
  additionalProperties: false,
};

const ModuleSchema = {
  id: "/ModuleSchema",
  type: ["string", "object"],
  properties: {
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
        },
      },
      required: true,
    },
    module: {
      type: "object",
      properties: {
        file: {
          type: "string",
        },
        language: {
          type: "string",
        },
      },
      required: ["file"],
    },
  },
};

export const manifestValidation = (manifest: Manifest) => {
  const v = new Validator();
  v.addSchema(ModuleSchema, "/ModuleSchema");
  return v.validate(manifest, ManifestSchema);
};

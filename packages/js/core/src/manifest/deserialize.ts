import { Schema as JsonSchema } from "jsonschema";

export interface DeserializeManifestOptions {
  noValidate?: boolean;
  extSchema?: JsonSchema;
}

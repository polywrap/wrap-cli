import { ILogger } from "@polywrap/logging-js";
import { Schema as JsonSchema } from "jsonschema";

export interface DeserializeManifestOptions {
  noValidate?: boolean;
  extSchema?: JsonSchema;
  logger?: ILogger;
}

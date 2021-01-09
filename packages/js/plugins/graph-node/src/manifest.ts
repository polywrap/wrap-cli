import {
  createSchemaDocument,
  PluginManifest
} from "@web3api/core-js";

export const manifest: PluginManifest = {
  // TODO: use the schema.graphql
  schema: createSchemaDocument("type Query { dummy: String }"),
  implemented: [],
  imported: []
};

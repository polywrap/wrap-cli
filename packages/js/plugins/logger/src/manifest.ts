import { PluginManifest, Uri } from "@web3api/core-js";

export const manifest: PluginManifest = {
  // TODO: use the schema.graphql
  // https://github.com/web3-api/monorepo/issues/101
  schema: "type Query { dummy: String }",
  implemented: [new Uri("w3/logger")],
  imported: [],
};

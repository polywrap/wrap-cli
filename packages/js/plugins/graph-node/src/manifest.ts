import { PluginManifest } from "@web3api/core-js";

export const manifest: PluginManifest = {
  schema: `
type Query {
  querySubgraph(
    subgraphId: String!
    query: String!
  ): String!
}`,
  implements: [],
};

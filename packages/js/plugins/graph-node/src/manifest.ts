import { PluginManifest } from "@web3api/core-js";

export const manifest: PluginManifest = {
  // TODO: use the schema.graphql
  // https://github.com/web3-api/monorepo/issues/101
  schema: `
type Query {
  querySubgraph(
    subgraphId: String!
    query: String!
  ): String! """JSON!"""
  """TODO: support JSON type as base type?"""
  """I think this would be helpful for dynamic data"""
}`,
  implemented: [],
  imported: [],
};

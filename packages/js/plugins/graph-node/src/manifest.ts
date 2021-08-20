import { PluginPackageManifest } from "@web3api/core-js";

export const manifest: PluginPackageManifest = {
  // TODO: use the schema.graphql
  // https://github.com/web3-api/monorepo/issues/101
  schema: `
type Query {
  querySubgraph(
    subgraphAuthor: String!
    subgraphName: String!
    query: String!
  ): String!
}
`,
  implements: [],
};

import { PluginPackageManifest } from "@web3api/core-js";

export const manifest: PluginPackageManifest = {
  // TODO: use the schema.graphql
  // https://github.com/web3-api/monorepo/issues/101
  schema: `
type Query {
  sampleQuery(data: String!): String!
}

type Mutation {
  sampleMutation(data: Bytes!): Boolean!
}`,
  implements: [],
};

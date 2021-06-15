import { PluginManifest } from "@web3api/core-js";

export const manifest: PluginManifest = {
  // TODO: use the schema.graphql
  // https://github.com/Web3-API/prototype/issues/101
  schema:
`type Query {
  toAscii(value: String!): String!
  toUnicode(value: String!): String!
  convert(value: String!): String!
}`,
  implemented: [],
  imported: [],
};

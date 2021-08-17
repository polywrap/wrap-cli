import { PluginManifest } from "@web3api/core-js";

export const manifest: PluginManifest = {
  // TODO: use the schema.graphql
  // https://github.com/Web3-API/prototype/issues/101
  schema: `type Query {
  sha3_512(message: String!): String!
  sha3_384(message: String!): String!
  sha3_256(message: String!): String!
  sha3_224(message: String!): String!

  keccak_512(message: String!): String!
  keccak_384(message: String!): String!
  keccak_256(message: String!): String!
  keccak_224(message: String!): String!

  hex_keccak_256(message: String!): String!
  buffer_keccak_256(message: Bytes!): String!

  shake_128(message: String!, outputBits: Int!): String!
  shake_256(message: String!, outputBits: Int!): String!
}`,
  implements: [],
};

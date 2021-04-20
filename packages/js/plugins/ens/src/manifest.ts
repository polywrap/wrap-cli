import { PluginManifest, Uri } from "@web3api/core-js";

export const manifest: PluginManifest = {
  // TODO: use the schema.graphql
  // https://github.com/web3-api/monorepo/issues/101
  schema: `
# TODO: should import and "implements" the api-resolver core-api schema
# https://github.com/Web3-API/monorepo/issues/75

type Query {
  tryResolveUri(
    authority: String!
    path: String!
  ): ApiResolver_MaybeUriOrManifest

  getFile(
    path: String!
  ): Bytes
}

# TODO: should get replaced with an import
# https://github.com/Web3-API/monorepo/issues/75
type ApiResolver_MaybeUriOrManifest {
  uri: String
  manifest: String
}`,
  implemented: [new Uri("w3/api-resolver")],
  imported: [new Uri("ens/ethereum.web3api.eth")],
};

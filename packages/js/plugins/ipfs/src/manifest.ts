import { PluginManifest, coreInterfaceUris } from "@web3api/core-js";

export const manifest: PluginManifest = {
  // TODO: use the schema.graphql
  // https://github.com/web3-api/monorepo/issues/101
  schema: `
# TODO: should import and "implements" the api-resolver core-api schema
# https://github.com/Web3-API/monorepo/issues/75

type Query {
  catFile(
    cid: String!
    options: Options
  ): Bytes!

  resolve(
    cid: String!
    options: Options
  ): ResolveResult

  tryResolveUri(
    authority: String!
    path: String!
  ): ApiResolver_MaybeUriOrManifest

  getFile(
    path: String!
  ): Bytes
}

type Mutation {
  # TODO: Allow for custom type CID
  # https://github.com/web3-api/monorepo/issues/103
  addFile(data: Bytes!): String!
}

type ResolveResult {
  cid: String!
  provider: String!
}

type Options {
  # Timeout (in ms) for the operation.
  # Fallback providers are used if timeout is reached.
  timeout: UInt64

  # The IPFS provider to be used
  provider: String
}

# TODO: should get replaced with an import
# https://github.com/Web3-API/monorepo/issues/75
type ApiResolver_MaybeUriOrManifest {
  uri: String
  manifest: String
}`,
  implements: [coreInterfaceUris.apiResolver],
};

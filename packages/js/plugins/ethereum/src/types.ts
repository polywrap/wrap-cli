// TODO: generated types here from the schema.graphql to ensure safety `Resolvers<TQuery, TMutation>`
// https://github.com/web3-api/monorepo/issues/101
export interface Connection {
  node?: string;
  networkNameOrChainId?: string;
}

export interface TxOverrides {
  nonce?: string;
  gasLimit?: string;
  gasPrice?: string;
  value?: string;
}

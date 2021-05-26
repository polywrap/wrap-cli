// TODO: generated types here from the schema.graphql to ensure safety `Resolvers<TQuery, TMutation>`
// https://github.com/web3-api/monorepo/issues/101
export interface Connection {
  node?: string;
  networkNameOrChainId?: string;
}

export interface Log {
  blockNumber: number;
  blockHash: string;
  transactionIndex: number;
  removed: boolean;
  address: string;
  data: string;
  topics: string[];
  transactionHash: string;
  logIndex: number;
}

export interface TxReceipt {
  to?: string;
  from: string;
  contractAddress?: string;
  transactionIndex: number;
  root?: string;
  gasUsed: string;
  logsBloom: string;
  blockHash: string;
  transactionHash: string;
  logs: Log[];
  blockNumber: number;
  confirmations: number;
  cumulativeGasUsed: string;
  byzantium: boolean;
  status: number;
}

export interface TxResponse {
  hash: string;
  blockNumber?: number;
  blockHash?: string;
  timestamp?: number;
  confirmations: number;
  from: string;
  raw?: string;
  nonce: string;
  gasLimit: string;
  gasPrice: string;
  data: string;
}

export interface TxRequest {
  to?: string;
  from?: string;
  nonce?: string;
  gasLimit?: string;
  gasPrice?: string;
  data?: string;
  value?: string;
  chainId?: number;
}

export interface TxOverrides {
  nonce?: string;
  gasLimit?: string;
  gasPrice?: string;
  value?: string;
}

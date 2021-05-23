import { PluginManifest } from "@web3api/core-js";

export const manifest: PluginManifest = {
  // TODO: use the schema.graphql
  // https://github.com/web3-api/monorepo/issues/101
  schema: `
type Log {
  blockNumber: Int!
  blockHash: String!
  transactionIndex: Int!
  removed: Boolean!
  address: String!
  data: String!
  topics: [String!]!
  transactionHash: String!
  logIndex: Int!
}

type TxReceipt {
  to: String!
  from: String!
  contractAddress: String!
  transactionIndex: Int!
  root: String
  gasUsed: String!
  logsBloom: String!
  blockHash: String!
  transactionHash: String!
  logs: [Log!]!,
  blockNumber: Int!
  confirmations: Int!
  cumulativeGasUsed: String!
  byzantium: Boolean!
  status: Int!
}

type TxResponse {
  hash: String!
  blockNumber: Int
  blockHash: String
  timestamp: Int
  confirmations: Int!
  from: String!
  raw: String
}

type TxRequest {
  to: String
  from: String
  nonce: String
  gasLimit: String
  gasPrice: String
  data: String
  value: String
  chainId: Int
}

type TxOverrides {
  nonce: String
  gasLimit: String
  gasPrice: String
  value: String
}

type Query {
  callView(
    address: String!
    method: String!
    args: [String!]
    connection: Connection
  ): String!

  signMessage(
    message: String!
    connection: Connection
  ): String!

  encodeParams(
    types: [String!]!
    values: [String!]!
  ): String!

  getSignerAddress(connection: Connection): String!

  getSignerBalance(
    blockTag: Int
    connection: Connection
  ): String!

  getSignerTransactionCount(
    blockTag: Int
    connection: Connection
  ): String!

  getGasPrice(connection: Connection): String!

  estimateContractCallGas(
    address: String!
    method: String!
    args: [String!]!
    connection: Connection
  ): String!

  checkAddress (address: String!): String!

  toWei (amount: String!): String!

  fromWei (amount: String!): String!

  estimateTxGas(
    tx: TxRequest!
    connection: Connection
  ): String!

  awaitTransaction(
    txHash: String!
    confirmations: Int!
    timeout: Int!
    connectionOverride: Connection
  ): TxReceipt!

  waitForEvent (
    address: String!
    event: String!
    args: [String]!
    timeout: Int
    connection: Connection
  ): String!
}

type Mutation {
  callContractMethod(
    address: String!
    method: String!
    args: [String!]
    connection: Connection
    txOverrides: TxOverrides
  ): TxResponse!

  callContractMethodAndWait(
    address: String!
    method: String!
    args: [String!]
    connection: Connection
    txOverrides: TxOverrides
  ): TxReceipt!

  deployContract(
    abi: String!
    bytecode: String!
    args: [String!]
    connection: Connection
  ): String!

  sendTransaction(
    tx: TxRequest!
    connection: Connection
  ): TxResponse!

  sendTransactionAndWait(
    tx: TxRequest!
    connection: Connection
  ): TxReceipt!

  sendRPC(
    method: String!
    params: [String!]!
    connection: Connection
  ): String
}

type Connection {
  node: String
  networkNameOrChainId: String
}`,
  implemented: [],
  imported: [],
};

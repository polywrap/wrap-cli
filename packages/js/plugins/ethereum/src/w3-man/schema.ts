/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.

export const schema: string = `### Web3API Header START ###
scalar UInt
scalar UInt8
scalar UInt16
scalar UInt32
scalar Int
scalar Int8
scalar Int16
scalar Int32
scalar Bytes
scalar BigInt
scalar BigNumber
scalar JSON
scalar Map

directive @imported(
  uri: String!
  namespace: String!
  nativeType: String!
) on OBJECT | ENUM

directive @imports(
  types: [String!]!
) on OBJECT

directive @capability(
  type: String!
  uri: String!
  namespace: String!
) repeatable on OBJECT

directive @enabled_interface on OBJECT

directive @annotate(type: String!) on FIELD

### Web3API Header END ###

type Module {
  callContractView(
    address: String!
    method: String!
    args: [String!]
    connection: Connection
  ): String!

  callContractStatic(
    address: String!
    method: String!
    args: [String!]
    connection: Connection
    txOverrides: TxOverrides
  ): StaticTxResult!

  getBalance(
    address: String!
    blockTag: BigInt
    connection: Connection
  ): BigInt!

  encodeParams(
    types: [String!]!
    values: [String!]!
  ): String!

  encodeFunction(
    method: String!
    args: [String!]
  ): String!

  solidityPack(
    types: [String!]!
    values: [String!]!
  ): String!

  solidityKeccak256(
    types: [String!]!
    values: [String!]!
  ): String!

  soliditySha256(
    types: [String!]!
    values: [String!]!
  ): String!

  getSignerAddress(
    connection: Connection
  ): String!

  getSignerBalance(
    blockTag: BigInt
    connection: Connection
  ): BigInt!

  getSignerTransactionCount(
    blockTag: BigInt
    connection: Connection
  ): BigInt!

  getGasPrice(
    connection: Connection
  ): BigInt!

  estimateTransactionGas(
    tx: TxRequest!
    connection: Connection
  ): BigInt!

  estimateContractCallGas(
    address: String!
    method: String!
    args: [String!]
    connection: Connection
    txOverrides: TxOverrides
  ): BigInt!

  checkAddress(
    address: String!
  ): Boolean!

  toWei(
    eth: String!
  ): BigInt!

  toEth(
    wei: BigInt!
  ): String!

  awaitTransaction(
    txHash: String!
    confirmations: UInt32!
    timeout: UInt32!
    connection: Connection
  ): TxReceipt!

  waitForEvent(
    address: String!
    event: String!
    args: [String!]
    timeout: UInt32
    connection: Connection
  ): EventNotification!

  getNetwork(
    connection: Connection
  ): Network!

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

  sendTransaction(
    tx: TxRequest!
    connection: Connection
  ): TxResponse!

  sendTransactionAndWait(
    tx: TxRequest!
    connection: Connection
  ): TxReceipt!

  deployContract(
    abi: String!
    bytecode: String!
    args: [String!]
    connection: Connection
  ): String!

  signMessage(
    message: String!
    connection: Connection
  ): String!

  sendRPC(
    method: String!
    params: [String!]!
    connection: Connection
  ): String
}

type Env {
  connection: Connection
}

type TxReceipt {
  to: String!
  from: String!
  contractAddress: String!
  transactionIndex: UInt32!
  root: String
  gasUsed: BigInt!
  logsBloom: String!
  transactionHash: String!
  logs: [Log!]!
  blockNumber: BigInt!
  blockHash: String!
  confirmations: UInt32!
  cumulativeGasUsed: BigInt!
  effectiveGasPrice: BigInt!
  byzantium: Boolean!
  type: UInt32!
  status: UInt32
}

type Log {
  blockNumber: BigInt!
  blockHash: String!
  transactionIndex: UInt32!
  removed: Boolean!
  address: String!
  data: String!
  topics: [String!]!
  transactionHash: String!
  logIndex: UInt32!
}

type TxResponse {
  hash: String!
  to: String
  from: String!
  nonce: UInt32!
  gasLimit: BigInt!
  gasPrice: BigInt
  data: String!
  value: BigInt!
  chainId: BigInt!
  blockNumber: BigInt
  blockHash: String
  timestamp: UInt32
  confirmations: UInt32!
  raw: String
  r: String
  s: String
  v: UInt32
  type: UInt32
  accessList: [Access!]
}

type Access {
  address: String!
  storageKeys: [String!]!
}

type TxRequest {
  to: String
  from: String
  nonce: UInt32
  gasLimit: BigInt
  gasPrice: BigInt
  data: String
  value: BigInt
  chainId: BigInt
  type: UInt32
}

type TxOverrides {
  gasLimit: BigInt
  gasPrice: BigInt
  value: BigInt
}

type StaticTxResult {
  result: String!
  error: Boolean!
}

type EventNotification {
  data: String!
  address: String!
  log: Log!
}

type Connection {
  node: String
  networkNameOrChainId: String
}

type Network {
  name: String!
  chainId: BigInt!
  ensAddress: String
}

### Imported Modules START ###

### Imported Modules END ###

### Imported Objects START ###

### Imported Objects END ###
`;

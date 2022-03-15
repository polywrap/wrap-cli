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
scalar JSON

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
### Web3API Header END ###

type Query implements Logger_Query @imports(
  types: [
    "Logger_Query",
    "Logger_LogLevel",
    "Ethereum_TxRequest"
  ]
) {
  log(
    level: Logger_LogLevel!
    message: String!
  ): Boolean!
}

### Imported Queries START ###

type Logger_Query @imported(
  uri: "ens/logger.core.web3api.eth",
  namespace: "Logger",
  nativeType: "Query"
) {
  log(
    level: Logger_LogLevel!
    message: String!
  ): Boolean!
}

### Imported Queries END ###

### Imported Objects START ###

type Ethereum_TxRequest @imported(
  uri: "ens/ethereum.web3api.eth",
  namespace: "Ethereum",
  nativeType: "TxRequest"
) {
  to: String
  from: String
  nonce: UInt32
  gasLimit: BigInt
  gasPrice: BigInt
  data: String
  value: BigInt
  chainId: UInt32
  type: UInt32
}

enum Logger_LogLevel @imported(
  uri: "ens/logger.core.web3api.eth",
  namespace: "Logger",
  nativeType: "LogLevel"
) {
  DEBUG
  INFO
  WARN
  ERROR
}

### Imported Objects END ###
`;

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

type Query implements Logger_Query @imports(
  types: [
    "Logger_Query",
    "Logger_LogLevel"
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

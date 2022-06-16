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

### Imported Queries START ###

type SimpleStorage_Mutation @imported(
  uri: "ens/simple-storage.eth",
  namespace: "SimpleStorage",
  nativeType: "Mutation"
) {
  setData(
    address: String!
    value: UInt32!
    connection: SimpleStorage_Ethereum_Connection
  ): String!

  deployContract(
    connection: SimpleStorage_Ethereum_Connection
  ): String!
}

type SimpleStorage_Query @imported(
  uri: "ens/simple-storage.eth",
  namespace: "SimpleStorage",
  nativeType: "Query"
) {
  getData(
    address: String!
    connection: SimpleStorage_Ethereum_Connection
  ): Int!
}

### Imported Queries END ###

### Imported Objects START ###

type SimpleStorage_Ethereum_Connection @imported(
  uri: "ens/simple-storage.eth",
  namespace: "SimpleStorage",
  nativeType: "Ethereum_Connection"
) {
  node: String
  networkNameOrChainId: String
}

### Imported Objects END ###
`;

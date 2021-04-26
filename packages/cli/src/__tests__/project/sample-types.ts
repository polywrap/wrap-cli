import { Client, PluginModule } from "@web3api/core-js";

export interface QueryModule extends PluginModule {
  getData: (
    input: Input_getData
  ) => number;
}

export interface Input_getData {
  address: string;
  connection?: Types.Ethereum_Connection | null;
}
export interface MutationModule extends PluginModule {
  setData: (
    input: Input_setData
  ) => Types.SetDataResult;
  deployContract: (
    input: Input_deployContract
  ) => string;
}

export interface Input_setData {
  options: Types.SetDataOptions;
  connection?: Types.Ethereum_Connection | null;
}
export interface Input_deployContract {
  connection?: Types.Ethereum_Connection | null;
}

export const schema = `### Web3API Header START ###
scalar UInt
scalar UInt8
scalar UInt16
scalar UInt32
scalar UInt64
scalar Int
scalar Int8
scalar Int16
scalar Int32
scalar Int64
scalar Bytes

directive @imported(
  uri: String!
  namespace: String!
  nativeType: String!
) on OBJECT | ENUM

directive @imports(
  types: [String!]!
) on OBJECT
### Web3API Header END ###

type Query @imports(
  types: [
    "Ethereum_Query",
    "Ethereum_Connection"
  ]
) {
  getData(
    address: String!
    connection: Ethereum_Connection
  ): UInt32!
}

type Mutation @imports(
  types: [
    "Ethereum_Mutation",
    "Ethereum_Connection"
  ]
) {
  setData(
    options: SetDataOptions!
    connection: Ethereum_Connection
  ): SetDataResult!

  deployContract(
    connection: Ethereum_Connection
  ): String!
}

type SetDataOptions {
  address: String!
  value: UInt32!
}

type SetDataResult {
  txReceipt: String!
  value: UInt32!
}

### Imported Queries START ###

type Ethereum_Query @imported(
  uri: "w3://ens/ethereum.web3api.eth",
  namespace: "Ethereum",
  nativeType: "Query"
) {
  callView(
    address: String!
    method: String!
    args: [String!]
    connection: Ethereum_Connection
  ): String!
}

type Ethereum_Mutation @imported(
  uri: "w3://ens/ethereum.web3api.eth",
  namespace: "Ethereum",
  nativeType: "Mutation"
) {
  sendTransaction(
    address: String!
    method: String!
    args: [String!]
    connection: Ethereum_Connection
  ): String!

  deployContract(
    abi: String!
    bytecode: String!
    args: [String!]
    connection: Ethereum_Connection
  ): String!
}

### Imported Queries END ###

### Imported Objects START ###

type Ethereum_Connection @imported(
  uri: "w3://ens/ethereum.web3api.eth",
  namespace: "Ethereum",
  nativeType: "Connection"
) {
  node: String
  networkNameOrChainId: String
}

### Imported Objects END ###
`;
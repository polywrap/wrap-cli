// @ts-ignore
import * as Types from "./";

// @ts-ignore
import {
  Client,
  Result
} from "@polywrap/core-js";

export type UInt = number;
export type UInt8 = number;
export type UInt16 = number;
export type UInt32 = number;
export type Int = number;
export type Int8 = number;
export type Int16 = number;
export type Int32 = number;
export type Bytes = Uint8Array;
export type BigInt = string;
export type BigNumber = string;
export type Json = string;
export type String = string;
export type Boolean = boolean;

/// Imported Objects START ///

/* URI: "wrap://ens/ethereum.polywrap.eth" */
export interface Ethereum_TxReceipt {
  to: Types.String;
  from: Types.String;
  contractAddress: Types.String;
  transactionIndex: Types.UInt32;
  root?: Types.String | null;
  gasUsed: Types.BigInt;
  logsBloom: Types.String;
  transactionHash: Types.String;
  logs: Array<Types.Ethereum_Log>;
  blockNumber: Types.BigInt;
  blockHash: Types.String;
  confirmations: Types.UInt32;
  cumulativeGasUsed: Types.BigInt;
  effectiveGasPrice: Types.BigInt;
  byzantium: Types.Boolean;
  type: Types.UInt32;
  status?: Types.UInt32 | null;
}

/* URI: "wrap://ens/ethereum.polywrap.eth" */
export interface Ethereum_Log {
  blockNumber: Types.BigInt;
  blockHash: Types.String;
  transactionIndex: Types.UInt32;
  removed: Types.Boolean;
  address: Types.String;
  data: Types.String;
  topics: Array<Types.String>;
  transactionHash: Types.String;
  logIndex: Types.UInt32;
}

/* URI: "wrap://ens/ethereum.polywrap.eth" */
export interface Ethereum_TxResponse {
  hash: Types.String;
  to?: Types.String | null;
  from: Types.String;
  nonce: Types.UInt32;
  gasLimit: Types.BigInt;
  gasPrice?: Types.BigInt | null;
  data: Types.String;
  value: Types.BigInt;
  chainId: Types.BigInt;
  blockNumber?: Types.BigInt | null;
  blockHash?: Types.String | null;
  timestamp?: Types.UInt32 | null;
  confirmations: Types.UInt32;
  raw?: Types.String | null;
  r?: Types.String | null;
  s?: Types.String | null;
  v?: Types.UInt32 | null;
  type?: Types.UInt32 | null;
  accessList?: Array<Types.Ethereum_Access> | null;
}

/* URI: "wrap://ens/ethereum.polywrap.eth" */
export interface Ethereum_Access {
  address: Types.String;
  storageKeys: Array<Types.String>;
}

/* URI: "wrap://ens/ethereum.polywrap.eth" */
export interface Ethereum_TxRequest {
  to?: Types.String | null;
  from?: Types.String | null;
  nonce?: Types.UInt32 | null;
  gasLimit?: Types.BigInt | null;
  gasPrice?: Types.BigInt | null;
  data?: Types.String | null;
  value?: Types.BigInt | null;
  chainId?: Types.BigInt | null;
  type?: Types.UInt32 | null;
}

/* URI: "wrap://ens/ethereum.polywrap.eth" */
export interface Ethereum_TxOverrides {
  gasLimit?: Types.BigInt | null;
  gasPrice?: Types.BigInt | null;
  value?: Types.BigInt | null;
}

/* URI: "wrap://ens/ethereum.polywrap.eth" */
export interface Ethereum_StaticTxResult {
  result: Types.String;
  error: Types.Boolean;
}

/* URI: "wrap://ens/ethereum.polywrap.eth" */
export interface Ethereum_EventNotification {
  data: Types.String;
  address: Types.String;
  log: Types.Ethereum_Log;
}

/* URI: "wrap://ens/ethereum.polywrap.eth" */
export interface Ethereum_Connection {
  node?: Types.String | null;
  networkNameOrChainId?: Types.String | null;
}

/* URI: "wrap://ens/ethereum.polywrap.eth" */
export interface Ethereum_Network {
  name: Types.String;
  chainId: Types.BigInt;
  ensAddress?: Types.String | null;
}

/// Imported Objects END ///

/// Imported Modules START ///

/* URI: "wrap://ens/ethereum.polywrap.eth" */
interface Ethereum_Module_Args_callContractView {
  address: Types.String;
  method: Types.String;
  args?: Array<Types.String> | null;
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "wrap://ens/ethereum.polywrap.eth" */
interface Ethereum_Module_Args_callContractStatic {
  address: Types.String;
  method: Types.String;
  args?: Array<Types.String> | null;
  connection?: Types.Ethereum_Connection | null;
  txOverrides?: Types.Ethereum_TxOverrides | null;
}

/* URI: "wrap://ens/ethereum.polywrap.eth" */
interface Ethereum_Module_Args_getBalance {
  address: Types.String;
  blockTag?: Types.BigInt | null;
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "wrap://ens/ethereum.polywrap.eth" */
interface Ethereum_Module_Args_encodeParams {
  types: Array<Types.String>;
  values: Array<Types.String>;
}

/* URI: "wrap://ens/ethereum.polywrap.eth" */
interface Ethereum_Module_Args_encodeFunction {
  method: Types.String;
  args?: Array<Types.String> | null;
}

/* URI: "wrap://ens/ethereum.polywrap.eth" */
interface Ethereum_Module_Args_solidityPack {
  types: Array<Types.String>;
  values: Array<Types.String>;
}

/* URI: "wrap://ens/ethereum.polywrap.eth" */
interface Ethereum_Module_Args_solidityKeccak256 {
  types: Array<Types.String>;
  values: Array<Types.String>;
}

/* URI: "wrap://ens/ethereum.polywrap.eth" */
interface Ethereum_Module_Args_soliditySha256 {
  types: Array<Types.String>;
  values: Array<Types.String>;
}

/* URI: "wrap://ens/ethereum.polywrap.eth" */
interface Ethereum_Module_Args_getSignerAddress {
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "wrap://ens/ethereum.polywrap.eth" */
interface Ethereum_Module_Args_getSignerBalance {
  blockTag?: Types.BigInt | null;
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "wrap://ens/ethereum.polywrap.eth" */
interface Ethereum_Module_Args_getSignerTransactionCount {
  blockTag?: Types.BigInt | null;
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "wrap://ens/ethereum.polywrap.eth" */
interface Ethereum_Module_Args_getGasPrice {
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "wrap://ens/ethereum.polywrap.eth" */
interface Ethereum_Module_Args_estimateTransactionGas {
  tx: Types.Ethereum_TxRequest;
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "wrap://ens/ethereum.polywrap.eth" */
interface Ethereum_Module_Args_estimateContractCallGas {
  address: Types.String;
  method: Types.String;
  args?: Array<Types.String> | null;
  connection?: Types.Ethereum_Connection | null;
  txOverrides?: Types.Ethereum_TxOverrides | null;
}

/* URI: "wrap://ens/ethereum.polywrap.eth" */
interface Ethereum_Module_Args_checkAddress {
  address: Types.String;
}

/* URI: "wrap://ens/ethereum.polywrap.eth" */
interface Ethereum_Module_Args_toWei {
  eth: Types.String;
}

/* URI: "wrap://ens/ethereum.polywrap.eth" */
interface Ethereum_Module_Args_toEth {
  wei: Types.BigInt;
}

/* URI: "wrap://ens/ethereum.polywrap.eth" */
interface Ethereum_Module_Args_awaitTransaction {
  txHash: Types.String;
  confirmations: Types.UInt32;
  timeout: Types.UInt32;
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "wrap://ens/ethereum.polywrap.eth" */
interface Ethereum_Module_Args_waitForEvent {
  address: Types.String;
  event: Types.String;
  args?: Array<Types.String> | null;
  timeout?: Types.UInt32 | null;
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "wrap://ens/ethereum.polywrap.eth" */
interface Ethereum_Module_Args_getNetwork {
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "wrap://ens/ethereum.polywrap.eth" */
interface Ethereum_Module_Args_requestAccounts {
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "wrap://ens/ethereum.polywrap.eth" */
interface Ethereum_Module_Args_callContractMethod {
  address: Types.String;
  method: Types.String;
  args?: Array<Types.String> | null;
  connection?: Types.Ethereum_Connection | null;
  txOverrides?: Types.Ethereum_TxOverrides | null;
}

/* URI: "wrap://ens/ethereum.polywrap.eth" */
interface Ethereum_Module_Args_callContractMethodAndWait {
  address: Types.String;
  method: Types.String;
  args?: Array<Types.String> | null;
  connection?: Types.Ethereum_Connection | null;
  txOverrides?: Types.Ethereum_TxOverrides | null;
}

/* URI: "wrap://ens/ethereum.polywrap.eth" */
interface Ethereum_Module_Args_sendTransaction {
  tx: Types.Ethereum_TxRequest;
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "wrap://ens/ethereum.polywrap.eth" */
interface Ethereum_Module_Args_sendTransactionAndWait {
  tx: Types.Ethereum_TxRequest;
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "wrap://ens/ethereum.polywrap.eth" */
interface Ethereum_Module_Args_deployContract {
  abi: Types.String;
  bytecode: Types.String;
  args?: Array<Types.String> | null;
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "wrap://ens/ethereum.polywrap.eth" */
interface Ethereum_Module_Args_signMessage {
  message: Types.String;
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "wrap://ens/ethereum.polywrap.eth" */
interface Ethereum_Module_Args_sendRPC {
  method: Types.String;
  params: Array<Types.String>;
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "wrap://ens/ethereum.polywrap.eth" */
export const Ethereum_Module = {
  callContractView: async (
    args: Ethereum_Module_Args_callContractView,
    client: Client,
    uri: string = "wrap://ens/ethereum.polywrap.eth"
  ): Promise<Result<Types.String, Error>> => {
    return client.invoke<Types.String>({
      uri,
      method: "callContractView",
      args: args as unknown as Record<string, unknown>
    });
  },

  callContractStatic: async (
    args: Ethereum_Module_Args_callContractStatic,
    client: Client,
    uri: string = "wrap://ens/ethereum.polywrap.eth"
  ): Promise<Result<Types.Ethereum_StaticTxResult, Error>> => {
    return client.invoke<Types.Ethereum_StaticTxResult>({
      uri,
      method: "callContractStatic",
      args: args as unknown as Record<string, unknown>
    });
  },

  getBalance: async (
    args: Ethereum_Module_Args_getBalance,
    client: Client,
    uri: string = "wrap://ens/ethereum.polywrap.eth"
  ): Promise<Result<Types.BigInt, Error>> => {
    return client.invoke<Types.BigInt>({
      uri,
      method: "getBalance",
      args: args as unknown as Record<string, unknown>
    });
  },

  encodeParams: async (
    args: Ethereum_Module_Args_encodeParams,
    client: Client,
    uri: string = "wrap://ens/ethereum.polywrap.eth"
  ): Promise<Result<Types.String, Error>> => {
    return client.invoke<Types.String>({
      uri,
      method: "encodeParams",
      args: args as unknown as Record<string, unknown>
    });
  },

  encodeFunction: async (
    args: Ethereum_Module_Args_encodeFunction,
    client: Client,
    uri: string = "wrap://ens/ethereum.polywrap.eth"
  ): Promise<Result<Types.String, Error>> => {
    return client.invoke<Types.String>({
      uri,
      method: "encodeFunction",
      args: args as unknown as Record<string, unknown>
    });
  },

  solidityPack: async (
    args: Ethereum_Module_Args_solidityPack,
    client: Client,
    uri: string = "wrap://ens/ethereum.polywrap.eth"
  ): Promise<Result<Types.String, Error>> => {
    return client.invoke<Types.String>({
      uri,
      method: "solidityPack",
      args: args as unknown as Record<string, unknown>
    });
  },

  solidityKeccak256: async (
    args: Ethereum_Module_Args_solidityKeccak256,
    client: Client,
    uri: string = "wrap://ens/ethereum.polywrap.eth"
  ): Promise<Result<Types.String, Error>> => {
    return client.invoke<Types.String>({
      uri,
      method: "solidityKeccak256",
      args: args as unknown as Record<string, unknown>
    });
  },

  soliditySha256: async (
    args: Ethereum_Module_Args_soliditySha256,
    client: Client,
    uri: string = "wrap://ens/ethereum.polywrap.eth"
  ): Promise<Result<Types.String, Error>> => {
    return client.invoke<Types.String>({
      uri,
      method: "soliditySha256",
      args: args as unknown as Record<string, unknown>
    });
  },

  getSignerAddress: async (
    args: Ethereum_Module_Args_getSignerAddress,
    client: Client,
    uri: string = "wrap://ens/ethereum.polywrap.eth"
  ): Promise<Result<Types.String, Error>> => {
    return client.invoke<Types.String>({
      uri,
      method: "getSignerAddress",
      args: args as unknown as Record<string, unknown>
    });
  },

  getSignerBalance: async (
    args: Ethereum_Module_Args_getSignerBalance,
    client: Client,
    uri: string = "wrap://ens/ethereum.polywrap.eth"
  ): Promise<Result<Types.BigInt, Error>> => {
    return client.invoke<Types.BigInt>({
      uri,
      method: "getSignerBalance",
      args: args as unknown as Record<string, unknown>
    });
  },

  getSignerTransactionCount: async (
    args: Ethereum_Module_Args_getSignerTransactionCount,
    client: Client,
    uri: string = "wrap://ens/ethereum.polywrap.eth"
  ): Promise<Result<Types.BigInt, Error>> => {
    return client.invoke<Types.BigInt>({
      uri,
      method: "getSignerTransactionCount",
      args: args as unknown as Record<string, unknown>
    });
  },

  getGasPrice: async (
    args: Ethereum_Module_Args_getGasPrice,
    client: Client,
    uri: string = "wrap://ens/ethereum.polywrap.eth"
  ): Promise<Result<Types.BigInt, Error>> => {
    return client.invoke<Types.BigInt>({
      uri,
      method: "getGasPrice",
      args: args as unknown as Record<string, unknown>
    });
  },

  estimateTransactionGas: async (
    args: Ethereum_Module_Args_estimateTransactionGas,
    client: Client,
    uri: string = "wrap://ens/ethereum.polywrap.eth"
  ): Promise<Result<Types.BigInt, Error>> => {
    return client.invoke<Types.BigInt>({
      uri,
      method: "estimateTransactionGas",
      args: args as unknown as Record<string, unknown>
    });
  },

  estimateContractCallGas: async (
    args: Ethereum_Module_Args_estimateContractCallGas,
    client: Client,
    uri: string = "wrap://ens/ethereum.polywrap.eth"
  ): Promise<Result<Types.BigInt, Error>> => {
    return client.invoke<Types.BigInt>({
      uri,
      method: "estimateContractCallGas",
      args: args as unknown as Record<string, unknown>
    });
  },

  checkAddress: async (
    args: Ethereum_Module_Args_checkAddress,
    client: Client,
    uri: string = "wrap://ens/ethereum.polywrap.eth"
  ): Promise<Result<Types.Boolean, Error>> => {
    return client.invoke<Types.Boolean>({
      uri,
      method: "checkAddress",
      args: args as unknown as Record<string, unknown>
    });
  },

  toWei: async (
    args: Ethereum_Module_Args_toWei,
    client: Client,
    uri: string = "wrap://ens/ethereum.polywrap.eth"
  ): Promise<Result<Types.BigInt, Error>> => {
    return client.invoke<Types.BigInt>({
      uri,
      method: "toWei",
      args: args as unknown as Record<string, unknown>
    });
  },

  toEth: async (
    args: Ethereum_Module_Args_toEth,
    client: Client,
    uri: string = "wrap://ens/ethereum.polywrap.eth"
  ): Promise<Result<Types.String, Error>> => {
    return client.invoke<Types.String>({
      uri,
      method: "toEth",
      args: args as unknown as Record<string, unknown>
    });
  },

  awaitTransaction: async (
    args: Ethereum_Module_Args_awaitTransaction,
    client: Client,
    uri: string = "wrap://ens/ethereum.polywrap.eth"
  ): Promise<Result<Types.Ethereum_TxReceipt, Error>> => {
    return client.invoke<Types.Ethereum_TxReceipt>({
      uri,
      method: "awaitTransaction",
      args: args as unknown as Record<string, unknown>
    });
  },

  waitForEvent: async (
    args: Ethereum_Module_Args_waitForEvent,
    client: Client,
    uri: string = "wrap://ens/ethereum.polywrap.eth"
  ): Promise<Result<Types.Ethereum_EventNotification, Error>> => {
    return client.invoke<Types.Ethereum_EventNotification>({
      uri,
      method: "waitForEvent",
      args: args as unknown as Record<string, unknown>
    });
  },

  getNetwork: async (
    args: Ethereum_Module_Args_getNetwork,
    client: Client,
    uri: string = "wrap://ens/ethereum.polywrap.eth"
  ): Promise<Result<Types.Ethereum_Network, Error>> => {
    return client.invoke<Types.Ethereum_Network>({
      uri,
      method: "getNetwork",
      args: args as unknown as Record<string, unknown>
    });
  },

  requestAccounts: async (
    args: Ethereum_Module_Args_requestAccounts,
    client: Client,
    uri: string = "wrap://ens/ethereum.polywrap.eth"
  ): Promise<Result<Array<Types.String>, Error>> => {
    return client.invoke<Array<Types.String>>({
      uri,
      method: "requestAccounts",
      args: args as unknown as Record<string, unknown>
    });
  },

  callContractMethod: async (
    args: Ethereum_Module_Args_callContractMethod,
    client: Client,
    uri: string = "wrap://ens/ethereum.polywrap.eth"
  ): Promise<Result<Types.Ethereum_TxResponse, Error>> => {
    return client.invoke<Types.Ethereum_TxResponse>({
      uri,
      method: "callContractMethod",
      args: args as unknown as Record<string, unknown>
    });
  },

  callContractMethodAndWait: async (
    args: Ethereum_Module_Args_callContractMethodAndWait,
    client: Client,
    uri: string = "wrap://ens/ethereum.polywrap.eth"
  ): Promise<Result<Types.Ethereum_TxReceipt, Error>> => {
    return client.invoke<Types.Ethereum_TxReceipt>({
      uri,
      method: "callContractMethodAndWait",
      args: args as unknown as Record<string, unknown>
    });
  },

  sendTransaction: async (
    args: Ethereum_Module_Args_sendTransaction,
    client: Client,
    uri: string = "wrap://ens/ethereum.polywrap.eth"
  ): Promise<Result<Types.Ethereum_TxResponse, Error>> => {
    return client.invoke<Types.Ethereum_TxResponse>({
      uri,
      method: "sendTransaction",
      args: args as unknown as Record<string, unknown>
    });
  },

  sendTransactionAndWait: async (
    args: Ethereum_Module_Args_sendTransactionAndWait,
    client: Client,
    uri: string = "wrap://ens/ethereum.polywrap.eth"
  ): Promise<Result<Types.Ethereum_TxReceipt, Error>> => {
    return client.invoke<Types.Ethereum_TxReceipt>({
      uri,
      method: "sendTransactionAndWait",
      args: args as unknown as Record<string, unknown>
    });
  },

  deployContract: async (
    args: Ethereum_Module_Args_deployContract,
    client: Client,
    uri: string = "wrap://ens/ethereum.polywrap.eth"
  ): Promise<Result<Types.String, Error>> => {
    return client.invoke<Types.String>({
      uri,
      method: "deployContract",
      args: args as unknown as Record<string, unknown>
    });
  },

  signMessage: async (
    args: Ethereum_Module_Args_signMessage,
    client: Client,
    uri: string = "wrap://ens/ethereum.polywrap.eth"
  ): Promise<Result<Types.String, Error>> => {
    return client.invoke<Types.String>({
      uri,
      method: "signMessage",
      args: args as unknown as Record<string, unknown>
    });
  },

  sendRPC: async (
    args: Ethereum_Module_Args_sendRPC,
    client: Client,
    uri: string = "wrap://ens/ethereum.polywrap.eth"
  ): Promise<Result<Types.String | null, Error>> => {
    return client.invoke<Types.String | null>({
      uri,
      method: "sendRPC",
      args: args as unknown as Record<string, unknown>
    });
  }
}

/// Imported Modules END ///

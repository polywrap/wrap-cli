/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.

// @ts-ignore
import * as Types from "./";

// @ts-ignore
import {
  CoreClient,
  InvokeResult,
  Uri,
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

/// Env START ///
export interface Env extends Record<string, unknown> {
  arg1: Types.String;
}
/// Env END ///

/// Objects START ///
export interface Object {
  u: Types.UInt;
  array: Array<Types.Boolean>;
  bytes?: Types.Bytes | null;
}

/// Objects END ///

/// Enums START ///
/// Enums END ///

/// Imported Objects START ///

/* URI: "ens/ethereum.polywrap.eth" */
export interface Ethereum_Connection {
  node?: Types.String | null;
  networkNameOrChainId?: Types.String | null;
}

/* URI: "ens/ethereum.polywrap.eth" */
export interface Ethereum_TxOverrides {
  gasLimit?: Types.BigInt | null;
  gasPrice?: Types.BigInt | null;
  value?: Types.BigInt | null;
}

/* URI: "ens/ethereum.polywrap.eth" */
export interface Ethereum_StaticTxResult {
  result: Types.String;
  error: Types.Boolean;
}

/* URI: "ens/ethereum.polywrap.eth" */
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

/* URI: "ens/ethereum.polywrap.eth" */
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

/* URI: "ens/ethereum.polywrap.eth" */
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

/* URI: "ens/ethereum.polywrap.eth" */
export interface Ethereum_EventNotification {
  data: Types.String;
  address: Types.String;
  log: Types.Ethereum_Log;
}

/* URI: "ens/ethereum.polywrap.eth" */
export interface Ethereum_Network {
  name: Types.String;
  chainId: Types.BigInt;
  ensAddress?: Types.String | null;
}

/* URI: "ens/ethereum.polywrap.eth" */
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

/* URI: "ens/ethereum.polywrap.eth" */
export interface Ethereum_Access {
  address: Types.String;
  storageKeys: Array<Types.String>;
}

/// Imported Objects END ///

/// Imported Modules START ///

/* URI: "ens/ethereum.polywrap.eth" */
export interface Ethereum_Module_Args_callContractView {
  address: Types.String;
  method: Types.String;
  args?: Array<Types.String> | null;
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "ens/ethereum.polywrap.eth" */
export interface Ethereum_Module_Args_callContractStatic {
  address: Types.String;
  method: Types.String;
  args?: Array<Types.String> | null;
  connection?: Types.Ethereum_Connection | null;
  txOverrides?: Types.Ethereum_TxOverrides | null;
}

/* URI: "ens/ethereum.polywrap.eth" */
export interface Ethereum_Module_Args_getBalance {
  address: Types.String;
  blockTag?: Types.BigInt | null;
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "ens/ethereum.polywrap.eth" */
export interface Ethereum_Module_Args_encodeParams {
  types: Array<Types.String>;
  values: Array<Types.String>;
}

/* URI: "ens/ethereum.polywrap.eth" */
export interface Ethereum_Module_Args_encodeFunction {
  method: Types.String;
  args?: Array<Types.String> | null;
}

/* URI: "ens/ethereum.polywrap.eth" */
export interface Ethereum_Module_Args_solidityPack {
  types: Array<Types.String>;
  values: Array<Types.String>;
}

/* URI: "ens/ethereum.polywrap.eth" */
export interface Ethereum_Module_Args_solidityKeccak256 {
  types: Array<Types.String>;
  values: Array<Types.String>;
}

/* URI: "ens/ethereum.polywrap.eth" */
export interface Ethereum_Module_Args_soliditySha256 {
  types: Array<Types.String>;
  values: Array<Types.String>;
}

/* URI: "ens/ethereum.polywrap.eth" */
export interface Ethereum_Module_Args_getSignerAddress {
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "ens/ethereum.polywrap.eth" */
export interface Ethereum_Module_Args_getSignerBalance {
  blockTag?: Types.BigInt | null;
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "ens/ethereum.polywrap.eth" */
export interface Ethereum_Module_Args_getSignerTransactionCount {
  blockTag?: Types.BigInt | null;
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "ens/ethereum.polywrap.eth" */
export interface Ethereum_Module_Args_getGasPrice {
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "ens/ethereum.polywrap.eth" */
export interface Ethereum_Module_Args_estimateTransactionGas {
  tx: Types.Ethereum_TxRequest;
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "ens/ethereum.polywrap.eth" */
export interface Ethereum_Module_Args_estimateContractCallGas {
  address: Types.String;
  method: Types.String;
  args?: Array<Types.String> | null;
  connection?: Types.Ethereum_Connection | null;
  txOverrides?: Types.Ethereum_TxOverrides | null;
}

/* URI: "ens/ethereum.polywrap.eth" */
export interface Ethereum_Module_Args_checkAddress {
  address: Types.String;
}

/* URI: "ens/ethereum.polywrap.eth" */
export interface Ethereum_Module_Args_toWei {
  eth: Types.String;
}

/* URI: "ens/ethereum.polywrap.eth" */
export interface Ethereum_Module_Args_toEth {
  wei: Types.BigInt;
}

/* URI: "ens/ethereum.polywrap.eth" */
export interface Ethereum_Module_Args_awaitTransaction {
  txHash: Types.String;
  confirmations: Types.UInt32;
  timeout: Types.UInt32;
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "ens/ethereum.polywrap.eth" */
export interface Ethereum_Module_Args_waitForEvent {
  address: Types.String;
  event: Types.String;
  args?: Array<Types.String> | null;
  timeout?: Types.UInt32 | null;
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "ens/ethereum.polywrap.eth" */
export interface Ethereum_Module_Args_getNetwork {
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "ens/ethereum.polywrap.eth" */
export interface Ethereum_Module_Args_requestAccounts {
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "ens/ethereum.polywrap.eth" */
export interface Ethereum_Module_Args_callContractMethod {
  address: Types.String;
  method: Types.String;
  args?: Array<Types.String> | null;
  connection?: Types.Ethereum_Connection | null;
  txOverrides?: Types.Ethereum_TxOverrides | null;
}

/* URI: "ens/ethereum.polywrap.eth" */
export interface Ethereum_Module_Args_callContractMethodAndWait {
  address: Types.String;
  method: Types.String;
  args?: Array<Types.String> | null;
  connection?: Types.Ethereum_Connection | null;
  txOverrides?: Types.Ethereum_TxOverrides | null;
}

/* URI: "ens/ethereum.polywrap.eth" */
export interface Ethereum_Module_Args_sendTransaction {
  tx: Types.Ethereum_TxRequest;
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "ens/ethereum.polywrap.eth" */
export interface Ethereum_Module_Args_sendTransactionAndWait {
  tx: Types.Ethereum_TxRequest;
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "ens/ethereum.polywrap.eth" */
export interface Ethereum_Module_Args_deployContract {
  abi: Types.String;
  bytecode: Types.String;
  args?: Array<Types.String> | null;
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "ens/ethereum.polywrap.eth" */
export interface Ethereum_Module_Args_signMessage {
  message: Types.String;
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "ens/ethereum.polywrap.eth" */
export interface Ethereum_Module_Args_signMessageBytes {
  bytes: Types.Bytes;
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "ens/ethereum.polywrap.eth" */
export interface Ethereum_Module_Args_signTypedData {
  payload: Types.Json;
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "ens/ethereum.polywrap.eth" */
export interface Ethereum_Module_Args_sendRPC {
  method: Types.String;
  params: Array<Types.String>;
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "ens/ethereum.polywrap.eth" */
export const Ethereum_Module = {
  callContractView: async (
    args: Ethereum_Module_Args_callContractView,
    client: CoreClient
  ): Promise<InvokeResult<Types.String>> => {
    return client.invoke<Types.String>({
      uri: Uri.from("ens/ethereum.polywrap.eth"),
      method: "callContractView",
      args: (args as unknown) as Record<string, unknown>,
    });
  },

  callContractStatic: async (
    args: Ethereum_Module_Args_callContractStatic,
    client: CoreClient
  ): Promise<InvokeResult<Types.Ethereum_StaticTxResult>> => {
    return client.invoke<Types.Ethereum_StaticTxResult>({
      uri: Uri.from("ens/ethereum.polywrap.eth"),
      method: "callContractStatic",
      args: (args as unknown) as Record<string, unknown>,
    });
  },

  getBalance: async (
    args: Ethereum_Module_Args_getBalance,
    client: CoreClient
  ): Promise<InvokeResult<Types.BigInt>> => {
    return client.invoke<Types.BigInt>({
      uri: Uri.from("ens/ethereum.polywrap.eth"),
      method: "getBalance",
      args: (args as unknown) as Record<string, unknown>,
    });
  },

  encodeParams: async (
    args: Ethereum_Module_Args_encodeParams,
    client: CoreClient
  ): Promise<InvokeResult<Types.String>> => {
    return client.invoke<Types.String>({
      uri: Uri.from("ens/ethereum.polywrap.eth"),
      method: "encodeParams",
      args: (args as unknown) as Record<string, unknown>,
    });
  },

  encodeFunction: async (
    args: Ethereum_Module_Args_encodeFunction,
    client: CoreClient
  ): Promise<InvokeResult<Types.String>> => {
    return client.invoke<Types.String>({
      uri: Uri.from("ens/ethereum.polywrap.eth"),
      method: "encodeFunction",
      args: (args as unknown) as Record<string, unknown>,
    });
  },

  solidityPack: async (
    args: Ethereum_Module_Args_solidityPack,
    client: CoreClient
  ): Promise<InvokeResult<Types.String>> => {
    return client.invoke<Types.String>({
      uri: Uri.from("ens/ethereum.polywrap.eth"),
      method: "solidityPack",
      args: (args as unknown) as Record<string, unknown>,
    });
  },

  solidityKeccak256: async (
    args: Ethereum_Module_Args_solidityKeccak256,
    client: CoreClient
  ): Promise<InvokeResult<Types.String>> => {
    return client.invoke<Types.String>({
      uri: Uri.from("ens/ethereum.polywrap.eth"),
      method: "solidityKeccak256",
      args: (args as unknown) as Record<string, unknown>,
    });
  },

  soliditySha256: async (
    args: Ethereum_Module_Args_soliditySha256,
    client: CoreClient
  ): Promise<InvokeResult<Types.String>> => {
    return client.invoke<Types.String>({
      uri: Uri.from("ens/ethereum.polywrap.eth"),
      method: "soliditySha256",
      args: (args as unknown) as Record<string, unknown>,
    });
  },

  getSignerAddress: async (
    args: Ethereum_Module_Args_getSignerAddress,
    client: CoreClient
  ): Promise<InvokeResult<Types.String>> => {
    return client.invoke<Types.String>({
      uri: Uri.from("ens/ethereum.polywrap.eth"),
      method: "getSignerAddress",
      args: (args as unknown) as Record<string, unknown>,
    });
  },

  getSignerBalance: async (
    args: Ethereum_Module_Args_getSignerBalance,
    client: CoreClient
  ): Promise<InvokeResult<Types.BigInt>> => {
    return client.invoke<Types.BigInt>({
      uri: Uri.from("ens/ethereum.polywrap.eth"),
      method: "getSignerBalance",
      args: (args as unknown) as Record<string, unknown>,
    });
  },

  getSignerTransactionCount: async (
    args: Ethereum_Module_Args_getSignerTransactionCount,
    client: CoreClient
  ): Promise<InvokeResult<Types.BigInt>> => {
    return client.invoke<Types.BigInt>({
      uri: Uri.from("ens/ethereum.polywrap.eth"),
      method: "getSignerTransactionCount",
      args: (args as unknown) as Record<string, unknown>,
    });
  },

  getGasPrice: async (
    args: Ethereum_Module_Args_getGasPrice,
    client: CoreClient
  ): Promise<InvokeResult<Types.BigInt>> => {
    return client.invoke<Types.BigInt>({
      uri: Uri.from("ens/ethereum.polywrap.eth"),
      method: "getGasPrice",
      args: (args as unknown) as Record<string, unknown>,
    });
  },

  estimateTransactionGas: async (
    args: Ethereum_Module_Args_estimateTransactionGas,
    client: CoreClient
  ): Promise<InvokeResult<Types.BigInt>> => {
    return client.invoke<Types.BigInt>({
      uri: Uri.from("ens/ethereum.polywrap.eth"),
      method: "estimateTransactionGas",
      args: (args as unknown) as Record<string, unknown>,
    });
  },

  estimateContractCallGas: async (
    args: Ethereum_Module_Args_estimateContractCallGas,
    client: CoreClient
  ): Promise<InvokeResult<Types.BigInt>> => {
    return client.invoke<Types.BigInt>({
      uri: Uri.from("ens/ethereum.polywrap.eth"),
      method: "estimateContractCallGas",
      args: (args as unknown) as Record<string, unknown>,
    });
  },

  checkAddress: async (
    args: Ethereum_Module_Args_checkAddress,
    client: CoreClient
  ): Promise<InvokeResult<Types.Boolean>> => {
    return client.invoke<Types.Boolean>({
      uri: Uri.from("ens/ethereum.polywrap.eth"),
      method: "checkAddress",
      args: (args as unknown) as Record<string, unknown>,
    });
  },

  toWei: async (
    args: Ethereum_Module_Args_toWei,
    client: CoreClient
  ): Promise<InvokeResult<Types.BigInt>> => {
    return client.invoke<Types.BigInt>({
      uri: Uri.from("ens/ethereum.polywrap.eth"),
      method: "toWei",
      args: (args as unknown) as Record<string, unknown>,
    });
  },

  toEth: async (
    args: Ethereum_Module_Args_toEth,
    client: CoreClient
  ): Promise<InvokeResult<Types.String>> => {
    return client.invoke<Types.String>({
      uri: Uri.from("ens/ethereum.polywrap.eth"),
      method: "toEth",
      args: (args as unknown) as Record<string, unknown>,
    });
  },

  awaitTransaction: async (
    args: Ethereum_Module_Args_awaitTransaction,
    client: CoreClient
  ): Promise<InvokeResult<Types.Ethereum_TxReceipt>> => {
    return client.invoke<Types.Ethereum_TxReceipt>({
      uri: Uri.from("ens/ethereum.polywrap.eth"),
      method: "awaitTransaction",
      args: (args as unknown) as Record<string, unknown>,
    });
  },

  waitForEvent: async (
    args: Ethereum_Module_Args_waitForEvent,
    client: CoreClient
  ): Promise<InvokeResult<Types.Ethereum_EventNotification>> => {
    return client.invoke<Types.Ethereum_EventNotification>({
      uri: Uri.from("ens/ethereum.polywrap.eth"),
      method: "waitForEvent",
      args: (args as unknown) as Record<string, unknown>,
    });
  },

  getNetwork: async (
    args: Ethereum_Module_Args_getNetwork,
    client: CoreClient
  ): Promise<InvokeResult<Types.Ethereum_Network>> => {
    return client.invoke<Types.Ethereum_Network>({
      uri: Uri.from("ens/ethereum.polywrap.eth"),
      method: "getNetwork",
      args: (args as unknown) as Record<string, unknown>,
    });
  },

  requestAccounts: async (
    args: Ethereum_Module_Args_requestAccounts,
    client: CoreClient
  ): Promise<InvokeResult<Array<Types.String>>> => {
    return client.invoke<Array<Types.String>>({
      uri: Uri.from("ens/ethereum.polywrap.eth"),
      method: "requestAccounts",
      args: (args as unknown) as Record<string, unknown>,
    });
  },

  callContractMethod: async (
    args: Ethereum_Module_Args_callContractMethod,
    client: CoreClient
  ): Promise<InvokeResult<Types.Ethereum_TxResponse>> => {
    return client.invoke<Types.Ethereum_TxResponse>({
      uri: Uri.from("ens/ethereum.polywrap.eth"),
      method: "callContractMethod",
      args: (args as unknown) as Record<string, unknown>,
    });
  },

  callContractMethodAndWait: async (
    args: Ethereum_Module_Args_callContractMethodAndWait,
    client: CoreClient
  ): Promise<InvokeResult<Types.Ethereum_TxReceipt>> => {
    return client.invoke<Types.Ethereum_TxReceipt>({
      uri: Uri.from("ens/ethereum.polywrap.eth"),
      method: "callContractMethodAndWait",
      args: (args as unknown) as Record<string, unknown>,
    });
  },

  sendTransaction: async (
    args: Ethereum_Module_Args_sendTransaction,
    client: CoreClient
  ): Promise<InvokeResult<Types.Ethereum_TxResponse>> => {
    return client.invoke<Types.Ethereum_TxResponse>({
      uri: Uri.from("ens/ethereum.polywrap.eth"),
      method: "sendTransaction",
      args: (args as unknown) as Record<string, unknown>,
    });
  },

  sendTransactionAndWait: async (
    args: Ethereum_Module_Args_sendTransactionAndWait,
    client: CoreClient
  ): Promise<InvokeResult<Types.Ethereum_TxReceipt>> => {
    return client.invoke<Types.Ethereum_TxReceipt>({
      uri: Uri.from("ens/ethereum.polywrap.eth"),
      method: "sendTransactionAndWait",
      args: (args as unknown) as Record<string, unknown>,
    });
  },

  deployContract: async (
    args: Ethereum_Module_Args_deployContract,
    client: CoreClient
  ): Promise<InvokeResult<Types.String>> => {
    return client.invoke<Types.String>({
      uri: Uri.from("ens/ethereum.polywrap.eth"),
      method: "deployContract",
      args: (args as unknown) as Record<string, unknown>,
    });
  },

  signMessage: async (
    args: Ethereum_Module_Args_signMessage,
    client: CoreClient
  ): Promise<InvokeResult<Types.String>> => {
    return client.invoke<Types.String>({
      uri: Uri.from("ens/ethereum.polywrap.eth"),
      method: "signMessage",
      args: (args as unknown) as Record<string, unknown>,
    });
  },

  signMessageBytes: async (
    args: Ethereum_Module_Args_signMessageBytes,
    client: CoreClient
  ): Promise<InvokeResult<Types.String>> => {
    return client.invoke<Types.String>({
      uri: Uri.from("ens/ethereum.polywrap.eth"),
      method: "signMessageBytes",
      args: (args as unknown) as Record<string, unknown>,
    });
  },

  signTypedData: async (
    args: Ethereum_Module_Args_signTypedData,
    client: CoreClient
  ): Promise<InvokeResult<Types.String | null>> => {
    return client.invoke<Types.String | null>({
      uri: Uri.from("ens/ethereum.polywrap.eth"),
      method: "signTypedData",
      args: (args as unknown) as Record<string, unknown>,
    });
  },

  sendRPC: async (
    args: Ethereum_Module_Args_sendRPC,
    client: CoreClient
  ): Promise<InvokeResult<Types.String | null>> => {
    return client.invoke<Types.String | null>({
      uri: Uri.from("ens/ethereum.polywrap.eth"),
      method: "sendRPC",
      args: (args as unknown) as Record<string, unknown>,
    });
  }
}

/// Imported Modules END ///

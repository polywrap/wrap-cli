/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.

// @ts-ignore
import * as Types from "./";

// @ts-ignore
import {
  Client,
  InvokeApiResult
} from "@web3api/core-js";

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

/// Envs START ///
export interface QueryEnv extends Record<string, unknown> {
  arg1: Types.String;
}
/// Envs END ///

/// Objects START ///
export interface Object {
  u: Types.UInt;
  array: Array<Types.Boolean>;
  bytes?: Types.Bytes | null;
}

/// Objects END ///

/// Enums START ///
/// Enums END ///

/// Unions START ///
/// Unions END ///

/// Imported Objects START ///
/* URI: "ens/ethereum.web3api.eth" */
export interface Ethereum_Connection {
  node?: Types.String | null;
  networkNameOrChainId?: Types.String | null;
}

/* URI: "ens/ethereum.web3api.eth" */
export interface Ethereum_TxOverrides {
  gasLimit?: Types.BigInt | null;
  gasPrice?: Types.BigInt | null;
  value?: Types.BigInt | null;
}

/* URI: "ens/ethereum.web3api.eth" */
export interface Ethereum_StaticTxResult {
  result: Types.String;
  error: Types.Boolean;
}

/* URI: "ens/ethereum.web3api.eth" */
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

/* URI: "ens/ethereum.web3api.eth" */
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

/* URI: "ens/ethereum.web3api.eth" */
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

/* URI: "ens/ethereum.web3api.eth" */
export interface Ethereum_EventNotification {
  data: Types.String;
  address: Types.String;
  log: Types.Ethereum_Log;
}

/* URI: "ens/ethereum.web3api.eth" */
export interface Ethereum_Network {
  name: Types.String;
  chainId: Types.BigInt;
  ensAddress?: Types.String | null;
}


/// Imported Objects END ///

/// Imported Queries START ///

/* URI: "ens/ethereum.web3api.eth" */
interface Ethereum_Query_Input_callContractView extends Record<string, unknown> {
  address: Types.String;
  method: Types.String;
  args?: Array<Types.String> | null;
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "ens/ethereum.web3api.eth" */
interface Ethereum_Query_Input_callContractStatic extends Record<string, unknown> {
  address: Types.String;
  method: Types.String;
  args?: Array<Types.String> | null;
  connection?: Types.Ethereum_Connection | null;
  txOverrides?: Types.Ethereum_TxOverrides | null;
}

/* URI: "ens/ethereum.web3api.eth" */
interface Ethereum_Query_Input_getBalance extends Record<string, unknown> {
  address: Types.String;
  blockTag?: Types.BigInt | null;
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "ens/ethereum.web3api.eth" */
interface Ethereum_Query_Input_encodeParams extends Record<string, unknown> {
  types: Array<Types.String>;
  values: Array<Types.String>;
}

/* URI: "ens/ethereum.web3api.eth" */
interface Ethereum_Query_Input_encodeFunction extends Record<string, unknown> {
  method: Types.String;
  args?: Array<Types.String> | null;
}

/* URI: "ens/ethereum.web3api.eth" */
interface Ethereum_Query_Input_solidityPack extends Record<string, unknown> {
  types: Array<Types.String>;
  values: Array<Types.String>;
}

/* URI: "ens/ethereum.web3api.eth" */
interface Ethereum_Query_Input_solidityKeccak256 extends Record<string, unknown> {
  types: Array<Types.String>;
  values: Array<Types.String>;
}

/* URI: "ens/ethereum.web3api.eth" */
interface Ethereum_Query_Input_soliditySha256 extends Record<string, unknown> {
  types: Array<Types.String>;
  values: Array<Types.String>;
}

/* URI: "ens/ethereum.web3api.eth" */
interface Ethereum_Query_Input_getSignerAddress extends Record<string, unknown> {
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "ens/ethereum.web3api.eth" */
interface Ethereum_Query_Input_getSignerBalance extends Record<string, unknown> {
  blockTag?: Types.BigInt | null;
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "ens/ethereum.web3api.eth" */
interface Ethereum_Query_Input_getSignerTransactionCount extends Record<string, unknown> {
  blockTag?: Types.BigInt | null;
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "ens/ethereum.web3api.eth" */
interface Ethereum_Query_Input_getGasPrice extends Record<string, unknown> {
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "ens/ethereum.web3api.eth" */
interface Ethereum_Query_Input_estimateTransactionGas extends Record<string, unknown> {
  tx: Types.Ethereum_TxRequest;
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "ens/ethereum.web3api.eth" */
interface Ethereum_Query_Input_estimateContractCallGas extends Record<string, unknown> {
  address: Types.String;
  method: Types.String;
  args?: Array<Types.String> | null;
  connection?: Types.Ethereum_Connection | null;
  txOverrides?: Types.Ethereum_TxOverrides | null;
}

/* URI: "ens/ethereum.web3api.eth" */
interface Ethereum_Query_Input_checkAddress extends Record<string, unknown> {
  address: Types.String;
}

/* URI: "ens/ethereum.web3api.eth" */
interface Ethereum_Query_Input_toWei extends Record<string, unknown> {
  eth: Types.String;
}

/* URI: "ens/ethereum.web3api.eth" */
interface Ethereum_Query_Input_toEth extends Record<string, unknown> {
  wei: Types.BigInt;
}

/* URI: "ens/ethereum.web3api.eth" */
interface Ethereum_Query_Input_awaitTransaction extends Record<string, unknown> {
  txHash: Types.String;
  confirmations: Types.UInt32;
  timeout: Types.UInt32;
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "ens/ethereum.web3api.eth" */
interface Ethereum_Query_Input_waitForEvent extends Record<string, unknown> {
  address: Types.String;
  event: Types.String;
  args?: Array<Types.String> | null;
  timeout?: Types.UInt32 | null;
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "ens/ethereum.web3api.eth" */
interface Ethereum_Query_Input_getNetwork extends Record<string, unknown> {
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "ens/ethereum.web3api.eth" */
export const Ethereum_Query = {
  callContractView: async (
    input: Ethereum_Query_Input_callContractView,
    client: Client
  ): Promise<InvokeApiResult<Types.String>> => {
    return client.invoke<Types.String>({
      uri: "ens/ethereum.web3api.eth",
      module: "query",
      method: "callContractView",
      input
    });
  },

  callContractStatic: async (
    input: Ethereum_Query_Input_callContractStatic,
    client: Client
  ): Promise<InvokeApiResult<Types.Ethereum_StaticTxResult>> => {
    return client.invoke<Types.Ethereum_StaticTxResult>({
      uri: "ens/ethereum.web3api.eth",
      module: "query",
      method: "callContractStatic",
      input
    });
  },

  getBalance: async (
    input: Ethereum_Query_Input_getBalance,
    client: Client
  ): Promise<InvokeApiResult<Types.BigInt>> => {
    return client.invoke<Types.BigInt>({
      uri: "ens/ethereum.web3api.eth",
      module: "query",
      method: "getBalance",
      input
    });
  },

  encodeParams: async (
    input: Ethereum_Query_Input_encodeParams,
    client: Client
  ): Promise<InvokeApiResult<Types.String>> => {
    return client.invoke<Types.String>({
      uri: "ens/ethereum.web3api.eth",
      module: "query",
      method: "encodeParams",
      input
    });
  },

  encodeFunction: async (
    input: Ethereum_Query_Input_encodeFunction,
    client: Client
  ): Promise<InvokeApiResult<Types.String>> => {
    return client.invoke<Types.String>({
      uri: "ens/ethereum.web3api.eth",
      module: "query",
      method: "encodeFunction",
      input
    });
  },

  solidityPack: async (
    input: Ethereum_Query_Input_solidityPack,
    client: Client
  ): Promise<InvokeApiResult<Types.String>> => {
    return client.invoke<Types.String>({
      uri: "ens/ethereum.web3api.eth",
      module: "query",
      method: "solidityPack",
      input
    });
  },

  solidityKeccak256: async (
    input: Ethereum_Query_Input_solidityKeccak256,
    client: Client
  ): Promise<InvokeApiResult<Types.String>> => {
    return client.invoke<Types.String>({
      uri: "ens/ethereum.web3api.eth",
      module: "query",
      method: "solidityKeccak256",
      input
    });
  },

  soliditySha256: async (
    input: Ethereum_Query_Input_soliditySha256,
    client: Client
  ): Promise<InvokeApiResult<Types.String>> => {
    return client.invoke<Types.String>({
      uri: "ens/ethereum.web3api.eth",
      module: "query",
      method: "soliditySha256",
      input
    });
  },

  getSignerAddress: async (
    input: Ethereum_Query_Input_getSignerAddress,
    client: Client
  ): Promise<InvokeApiResult<Types.String>> => {
    return client.invoke<Types.String>({
      uri: "ens/ethereum.web3api.eth",
      module: "query",
      method: "getSignerAddress",
      input
    });
  },

  getSignerBalance: async (
    input: Ethereum_Query_Input_getSignerBalance,
    client: Client
  ): Promise<InvokeApiResult<Types.BigInt>> => {
    return client.invoke<Types.BigInt>({
      uri: "ens/ethereum.web3api.eth",
      module: "query",
      method: "getSignerBalance",
      input
    });
  },

  getSignerTransactionCount: async (
    input: Ethereum_Query_Input_getSignerTransactionCount,
    client: Client
  ): Promise<InvokeApiResult<Types.BigInt>> => {
    return client.invoke<Types.BigInt>({
      uri: "ens/ethereum.web3api.eth",
      module: "query",
      method: "getSignerTransactionCount",
      input
    });
  },

  getGasPrice: async (
    input: Ethereum_Query_Input_getGasPrice,
    client: Client
  ): Promise<InvokeApiResult<Types.BigInt>> => {
    return client.invoke<Types.BigInt>({
      uri: "ens/ethereum.web3api.eth",
      module: "query",
      method: "getGasPrice",
      input
    });
  },

  estimateTransactionGas: async (
    input: Ethereum_Query_Input_estimateTransactionGas,
    client: Client
  ): Promise<InvokeApiResult<Types.BigInt>> => {
    return client.invoke<Types.BigInt>({
      uri: "ens/ethereum.web3api.eth",
      module: "query",
      method: "estimateTransactionGas",
      input
    });
  },

  estimateContractCallGas: async (
    input: Ethereum_Query_Input_estimateContractCallGas,
    client: Client
  ): Promise<InvokeApiResult<Types.BigInt>> => {
    return client.invoke<Types.BigInt>({
      uri: "ens/ethereum.web3api.eth",
      module: "query",
      method: "estimateContractCallGas",
      input
    });
  },

  checkAddress: async (
    input: Ethereum_Query_Input_checkAddress,
    client: Client
  ): Promise<InvokeApiResult<Types.Boolean>> => {
    return client.invoke<Types.Boolean>({
      uri: "ens/ethereum.web3api.eth",
      module: "query",
      method: "checkAddress",
      input
    });
  },

  toWei: async (
    input: Ethereum_Query_Input_toWei,
    client: Client
  ): Promise<InvokeApiResult<Types.BigInt>> => {
    return client.invoke<Types.BigInt>({
      uri: "ens/ethereum.web3api.eth",
      module: "query",
      method: "toWei",
      input
    });
  },

  toEth: async (
    input: Ethereum_Query_Input_toEth,
    client: Client
  ): Promise<InvokeApiResult<Types.String>> => {
    return client.invoke<Types.String>({
      uri: "ens/ethereum.web3api.eth",
      module: "query",
      method: "toEth",
      input
    });
  },

  awaitTransaction: async (
    input: Ethereum_Query_Input_awaitTransaction,
    client: Client
  ): Promise<InvokeApiResult<Types.Ethereum_TxReceipt>> => {
    return client.invoke<Types.Ethereum_TxReceipt>({
      uri: "ens/ethereum.web3api.eth",
      module: "query",
      method: "awaitTransaction",
      input
    });
  },

  waitForEvent: async (
    input: Ethereum_Query_Input_waitForEvent,
    client: Client
  ): Promise<InvokeApiResult<Types.Ethereum_EventNotification>> => {
    return client.invoke<Types.Ethereum_EventNotification>({
      uri: "ens/ethereum.web3api.eth",
      module: "query",
      method: "waitForEvent",
      input
    });
  },

  getNetwork: async (
    input: Ethereum_Query_Input_getNetwork,
    client: Client
  ): Promise<InvokeApiResult<Types.Ethereum_Network>> => {
    return client.invoke<Types.Ethereum_Network>({
      uri: "ens/ethereum.web3api.eth",
      module: "query",
      method: "getNetwork",
      input
    });
  }
}

/// Imported Queries END ///

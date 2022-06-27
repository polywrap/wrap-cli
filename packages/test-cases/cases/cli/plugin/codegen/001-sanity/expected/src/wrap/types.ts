/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.

// @ts-ignore
import * as Types from "./";

// @ts-ignore
import {
  Client,
  InvokeResult
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

/// Envs START ///
export interface Env extends Record<string, unknown> {
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
interface Ethereum_Module_Args_callContractView extends Record<string, unknown> {
  address: Types.String;
  method: Types.String;
  args?: Array<Types.String> | null;
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "ens/ethereum.polywrap.eth" */
interface Ethereum_Module_Args_callContractStatic extends Record<string, unknown> {
  address: Types.String;
  method: Types.String;
  args?: Array<Types.String> | null;
  connection?: Types.Ethereum_Connection | null;
  txOverrides?: Types.Ethereum_TxOverrides | null;
}

/* URI: "ens/ethereum.polywrap.eth" */
interface Ethereum_Module_Args_getBalance extends Record<string, unknown> {
  address: Types.String;
  blockTag?: Types.BigInt | null;
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "ens/ethereum.polywrap.eth" */
interface Ethereum_Module_Args_encodeParams extends Record<string, unknown> {
  types: Array<Types.String>;
  values: Array<Types.String>;
}

/* URI: "ens/ethereum.polywrap.eth" */
interface Ethereum_Module_Args_encodeFunction extends Record<string, unknown> {
  method: Types.String;
  args?: Array<Types.String> | null;
}

/* URI: "ens/ethereum.polywrap.eth" */
interface Ethereum_Module_Args_solidityPack extends Record<string, unknown> {
  types: Array<Types.String>;
  values: Array<Types.String>;
}

/* URI: "ens/ethereum.polywrap.eth" */
interface Ethereum_Module_Args_solidityKeccak256 extends Record<string, unknown> {
  types: Array<Types.String>;
  values: Array<Types.String>;
}

/* URI: "ens/ethereum.polywrap.eth" */
interface Ethereum_Module_Args_soliditySha256 extends Record<string, unknown> {
  types: Array<Types.String>;
  values: Array<Types.String>;
}

/* URI: "ens/ethereum.polywrap.eth" */
interface Ethereum_Module_Args_getSignerAddress extends Record<string, unknown> {
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "ens/ethereum.polywrap.eth" */
interface Ethereum_Module_Args_getSignerBalance extends Record<string, unknown> {
  blockTag?: Types.BigInt | null;
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "ens/ethereum.polywrap.eth" */
interface Ethereum_Module_Args_getSignerTransactionCount extends Record<string, unknown> {
  blockTag?: Types.BigInt | null;
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "ens/ethereum.polywrap.eth" */
interface Ethereum_Module_Args_getGasPrice extends Record<string, unknown> {
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "ens/ethereum.polywrap.eth" */
interface Ethereum_Module_Args_estimateTransactionGas extends Record<string, unknown> {
  tx: Types.Ethereum_TxRequest;
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "ens/ethereum.polywrap.eth" */
interface Ethereum_Module_Args_estimateContractCallGas extends Record<string, unknown> {
  address: Types.String;
  method: Types.String;
  args?: Array<Types.String> | null;
  connection?: Types.Ethereum_Connection | null;
  txOverrides?: Types.Ethereum_TxOverrides | null;
}

/* URI: "ens/ethereum.polywrap.eth" */
interface Ethereum_Module_Args_checkAddress extends Record<string, unknown> {
  address: Types.String;
}

/* URI: "ens/ethereum.polywrap.eth" */
interface Ethereum_Module_Args_toWei extends Record<string, unknown> {
  eth: Types.String;
}

/* URI: "ens/ethereum.polywrap.eth" */
interface Ethereum_Module_Args_toEth extends Record<string, unknown> {
  wei: Types.BigInt;
}

/* URI: "ens/ethereum.polywrap.eth" */
interface Ethereum_Module_Args_awaitTransaction extends Record<string, unknown> {
  txHash: Types.String;
  confirmations: Types.UInt32;
  timeout: Types.UInt32;
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "ens/ethereum.polywrap.eth" */
interface Ethereum_Module_Args_waitForEvent extends Record<string, unknown> {
  address: Types.String;
  event: Types.String;
  args?: Array<Types.String> | null;
  timeout?: Types.UInt32 | null;
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "ens/ethereum.polywrap.eth" */
interface Ethereum_Module_Args_getNetwork extends Record<string, unknown> {
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "ens/ethereum.polywrap.eth" */
interface Ethereum_Module_Args_callContractMethod extends Record<string, unknown> {
  address: Types.String;
  method: Types.String;
  args?: Array<Types.String> | null;
  connection?: Types.Ethereum_Connection | null;
  txOverrides?: Types.Ethereum_TxOverrides | null;
}

/* URI: "ens/ethereum.polywrap.eth" */
interface Ethereum_Module_Args_callContractMethodAndWait extends Record<string, unknown> {
  address: Types.String;
  method: Types.String;
  args?: Array<Types.String> | null;
  connection?: Types.Ethereum_Connection | null;
  txOverrides?: Types.Ethereum_TxOverrides | null;
}

/* URI: "ens/ethereum.polywrap.eth" */
interface Ethereum_Module_Args_sendTransaction extends Record<string, unknown> {
  tx: Types.Ethereum_TxRequest;
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "ens/ethereum.polywrap.eth" */
interface Ethereum_Module_Args_sendTransactionAndWait extends Record<string, unknown> {
  tx: Types.Ethereum_TxRequest;
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "ens/ethereum.polywrap.eth" */
interface Ethereum_Module_Args_deployContract extends Record<string, unknown> {
  abi: Types.String;
  bytecode: Types.String;
  args?: Array<Types.String> | null;
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "ens/ethereum.polywrap.eth" */
interface Ethereum_Module_Args_signMessage extends Record<string, unknown> {
  message: Types.String;
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "ens/ethereum.polywrap.eth" */
interface Ethereum_Module_Args_sendRPC extends Record<string, unknown> {
  method: Types.String;
  params: Array<Types.String>;
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "ens/ethereum.polywrap.eth" */
export const Ethereum_Module = {
  callContractView: async (
    args: Ethereum_Module_Args_callContractView,
    client: Client
  ): Promise<InvokeResult<Types.String>> => {
    return client.invoke<Types.String>({
      uri: "ens/ethereum.polywrap.eth",
      method: "callContractView",
      args
    });
  },

  callContractStatic: async (
    args: Ethereum_Module_Args_callContractStatic,
    client: Client
  ): Promise<InvokeResult<Types.Ethereum_StaticTxResult>> => {
    return client.invoke<Types.Ethereum_StaticTxResult>({
      uri: "ens/ethereum.polywrap.eth",
      method: "callContractStatic",
      args
    });
  },

  getBalance: async (
    args: Ethereum_Module_Args_getBalance,
    client: Client
  ): Promise<InvokeResult<Types.BigInt>> => {
    return client.invoke<Types.BigInt>({
      uri: "ens/ethereum.polywrap.eth",
      method: "getBalance",
      args
    });
  },

  encodeParams: async (
    args: Ethereum_Module_Args_encodeParams,
    client: Client
  ): Promise<InvokeResult<Types.String>> => {
    return client.invoke<Types.String>({
      uri: "ens/ethereum.polywrap.eth",
      method: "encodeParams",
      args
    });
  },

  encodeFunction: async (
    args: Ethereum_Module_Args_encodeFunction,
    client: Client
  ): Promise<InvokeResult<Types.String>> => {
    return client.invoke<Types.String>({
      uri: "ens/ethereum.polywrap.eth",
      method: "encodeFunction",
      args
    });
  },

  solidityPack: async (
    args: Ethereum_Module_Args_solidityPack,
    client: Client
  ): Promise<InvokeResult<Types.String>> => {
    return client.invoke<Types.String>({
      uri: "ens/ethereum.polywrap.eth",
      method: "solidityPack",
      args
    });
  },

  solidityKeccak256: async (
    args: Ethereum_Module_Args_solidityKeccak256,
    client: Client
  ): Promise<InvokeResult<Types.String>> => {
    return client.invoke<Types.String>({
      uri: "ens/ethereum.polywrap.eth",
      method: "solidityKeccak256",
      args
    });
  },

  soliditySha256: async (
    args: Ethereum_Module_Args_soliditySha256,
    client: Client
  ): Promise<InvokeResult<Types.String>> => {
    return client.invoke<Types.String>({
      uri: "ens/ethereum.polywrap.eth",
      method: "soliditySha256",
      args
    });
  },

  getSignerAddress: async (
    args: Ethereum_Module_Args_getSignerAddress,
    client: Client
  ): Promise<InvokeResult<Types.String>> => {
    return client.invoke<Types.String>({
      uri: "ens/ethereum.polywrap.eth",
      method: "getSignerAddress",
      args
    });
  },

  getSignerBalance: async (
    args: Ethereum_Module_Args_getSignerBalance,
    client: Client
  ): Promise<InvokeResult<Types.BigInt>> => {
    return client.invoke<Types.BigInt>({
      uri: "ens/ethereum.polywrap.eth",
      method: "getSignerBalance",
      args
    });
  },

  getSignerTransactionCount: async (
    args: Ethereum_Module_Args_getSignerTransactionCount,
    client: Client
  ): Promise<InvokeResult<Types.BigInt>> => {
    return client.invoke<Types.BigInt>({
      uri: "ens/ethereum.polywrap.eth",
      method: "getSignerTransactionCount",
      args
    });
  },

  getGasPrice: async (
    args: Ethereum_Module_Args_getGasPrice,
    client: Client
  ): Promise<InvokeResult<Types.BigInt>> => {
    return client.invoke<Types.BigInt>({
      uri: "ens/ethereum.polywrap.eth",
      method: "getGasPrice",
      args
    });
  },

  estimateTransactionGas: async (
    args: Ethereum_Module_Args_estimateTransactionGas,
    client: Client
  ): Promise<InvokeResult<Types.BigInt>> => {
    return client.invoke<Types.BigInt>({
      uri: "ens/ethereum.polywrap.eth",
      method: "estimateTransactionGas",
      args
    });
  },

  estimateContractCallGas: async (
    args: Ethereum_Module_Args_estimateContractCallGas,
    client: Client
  ): Promise<InvokeResult<Types.BigInt>> => {
    return client.invoke<Types.BigInt>({
      uri: "ens/ethereum.polywrap.eth",
      method: "estimateContractCallGas",
      args
    });
  },

  checkAddress: async (
    args: Ethereum_Module_Args_checkAddress,
    client: Client
  ): Promise<InvokeResult<Types.Boolean>> => {
    return client.invoke<Types.Boolean>({
      uri: "ens/ethereum.polywrap.eth",
      method: "checkAddress",
      args
    });
  },

  toWei: async (
    args: Ethereum_Module_Args_toWei,
    client: Client
  ): Promise<InvokeResult<Types.BigInt>> => {
    return client.invoke<Types.BigInt>({
      uri: "ens/ethereum.polywrap.eth",
      method: "toWei",
      args
    });
  },

  toEth: async (
    args: Ethereum_Module_Args_toEth,
    client: Client
  ): Promise<InvokeResult<Types.String>> => {
    return client.invoke<Types.String>({
      uri: "ens/ethereum.polywrap.eth",
      method: "toEth",
      args
    });
  },

  awaitTransaction: async (
    args: Ethereum_Module_Args_awaitTransaction,
    client: Client
  ): Promise<InvokeResult<Types.Ethereum_TxReceipt>> => {
    return client.invoke<Types.Ethereum_TxReceipt>({
      uri: "ens/ethereum.polywrap.eth",
      method: "awaitTransaction",
      args
    });
  },

  waitForEvent: async (
    args: Ethereum_Module_Args_waitForEvent,
    client: Client
  ): Promise<InvokeResult<Types.Ethereum_EventNotification>> => {
    return client.invoke<Types.Ethereum_EventNotification>({
      uri: "ens/ethereum.polywrap.eth",
      method: "waitForEvent",
      args
    });
  },

  getNetwork: async (
    args: Ethereum_Module_Args_getNetwork,
    client: Client
  ): Promise<InvokeResult<Types.Ethereum_Network>> => {
    return client.invoke<Types.Ethereum_Network>({
      uri: "ens/ethereum.polywrap.eth",
      method: "getNetwork",
      args
    });
  },

  callContractMethod: async (
    args: Ethereum_Module_Args_callContractMethod,
    client: Client
  ): Promise<InvokeResult<Types.Ethereum_TxResponse>> => {
    return client.invoke<Types.Ethereum_TxResponse>({
      uri: "ens/ethereum.polywrap.eth",
      method: "callContractMethod",
      args
    });
  },

  callContractMethodAndWait: async (
    args: Ethereum_Module_Args_callContractMethodAndWait,
    client: Client
  ): Promise<InvokeResult<Types.Ethereum_TxReceipt>> => {
    return client.invoke<Types.Ethereum_TxReceipt>({
      uri: "ens/ethereum.polywrap.eth",
      method: "callContractMethodAndWait",
      args
    });
  },

  sendTransaction: async (
    args: Ethereum_Module_Args_sendTransaction,
    client: Client
  ): Promise<InvokeResult<Types.Ethereum_TxResponse>> => {
    return client.invoke<Types.Ethereum_TxResponse>({
      uri: "ens/ethereum.polywrap.eth",
      method: "sendTransaction",
      args
    });
  },

  sendTransactionAndWait: async (
    args: Ethereum_Module_Args_sendTransactionAndWait,
    client: Client
  ): Promise<InvokeResult<Types.Ethereum_TxReceipt>> => {
    return client.invoke<Types.Ethereum_TxReceipt>({
      uri: "ens/ethereum.polywrap.eth",
      method: "sendTransactionAndWait",
      args
    });
  },

  deployContract: async (
    args: Ethereum_Module_Args_deployContract,
    client: Client
  ): Promise<InvokeResult<Types.String>> => {
    return client.invoke<Types.String>({
      uri: "ens/ethereum.polywrap.eth",
      method: "deployContract",
      args
    });
  },

  signMessage: async (
    args: Ethereum_Module_Args_signMessage,
    client: Client
  ): Promise<InvokeResult<Types.String>> => {
    return client.invoke<Types.String>({
      uri: "ens/ethereum.polywrap.eth",
      method: "signMessage",
      args
    });
  },

  sendRPC: async (
    args: Ethereum_Module_Args_sendRPC,
    client: Client
  ): Promise<InvokeResult<Types.String | null>> => {
    return client.invoke<Types.String | null>({
      uri: "ens/ethereum.polywrap.eth",
      method: "sendRPC",
      args
    });
  }
}

/// Imported Modules END ///

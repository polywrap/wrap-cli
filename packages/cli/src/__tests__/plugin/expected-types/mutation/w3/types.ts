/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */

import * as Types from "./";

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
export type Json = string;
export type String = string;
export type Boolean = boolean;

/// Envs START ///
/// Envs END ///

/// Objects START ///
/// Objects END ///

/// Enums START ///
/// Enums END ///

/// Imported Objects START ///

/* URI: "ens/ethereum.web3api.eth" */
export interface Ethereum_Connection {
  node?: String | null;
  networkNameOrChainId?: String | null;
}

/* URI: "ens/ethereum.web3api.eth" */
export interface Ethereum_TxOverrides {
  gasLimit?: BigInt | null;
  gasPrice?: BigInt | null;
  value?: BigInt | null;
}

/* URI: "ens/ethereum.web3api.eth" */
export interface Ethereum_TxResponse {
  hash: String;
  to?: String | null;
  from: String;
  nonce: UInt32;
  gasLimit: BigInt;
  gasPrice?: BigInt | null;
  data: String;
  value: BigInt;
  chainId: BigInt;
  blockNumber?: BigInt | null;
  blockHash?: String | null;
  timestamp?: UInt32 | null;
  confirmations: UInt32;
  raw?: String | null;
  r?: String | null;
  s?: String | null;
  v?: UInt32 | null;
  type?: UInt32 | null;
  accessList?: Array<Types.Ethereum_Access> | null;
}

/* URI: "ens/ethereum.web3api.eth" */
export interface Ethereum_Access {
  address: String;
  storageKeys: Array<String>;
}

/* URI: "ens/ethereum.web3api.eth" */
export interface Ethereum_TxReceipt {
  to: String;
  from: String;
  contractAddress: String;
  transactionIndex: UInt32;
  root?: String | null;
  gasUsed: BigInt;
  logsBloom: String;
  transactionHash: String;
  logs: Array<Types.Ethereum_Log>;
  blockNumber: BigInt;
  blockHash: String;
  confirmations: UInt32;
  cumulativeGasUsed: BigInt;
  effectiveGasPrice: BigInt;
  byzantium: Boolean;
  type: UInt32;
  status?: UInt32 | null;
}

/* URI: "ens/ethereum.web3api.eth" */
export interface Ethereum_Log {
  blockNumber: BigInt;
  blockHash: String;
  transactionIndex: UInt32;
  removed: Boolean;
  address: String;
  data: String;
  topics: Array<String>;
  transactionHash: String;
  logIndex: UInt32;
}

/* URI: "ens/ethereum.web3api.eth" */
export interface Ethereum_TxRequest {
  to?: String | null;
  from?: String | null;
  nonce?: UInt32 | null;
  gasLimit?: BigInt | null;
  gasPrice?: BigInt | null;
  data?: String | null;
  value?: BigInt | null;
  chainId?: BigInt | null;
  type?: UInt32 | null;
}

/// Imported Objects END ///

/// Imported Queries START ///

/* URI: "ens/ethereum.web3api.eth" */
interface Ethereum_Mutation_Input_callContractMethod extends Record<string, unknown> {
  address: String;
  method: String;
  args?: Array<String> | null;
  connection?: Types.Ethereum_Connection | null;
  txOverrides?: Types.Ethereum_TxOverrides | null;
}

/* URI: "ens/ethereum.web3api.eth" */
interface Ethereum_Mutation_Input_callContractMethodAndWait extends Record<string, unknown> {
  address: String;
  method: String;
  args?: Array<String> | null;
  connection?: Types.Ethereum_Connection | null;
  txOverrides?: Types.Ethereum_TxOverrides | null;
}

/* URI: "ens/ethereum.web3api.eth" */
interface Ethereum_Mutation_Input_sendTransaction extends Record<string, unknown> {
  tx: Types.Ethereum_TxRequest;
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "ens/ethereum.web3api.eth" */
interface Ethereum_Mutation_Input_sendTransactionAndWait extends Record<string, unknown> {
  tx: Types.Ethereum_TxRequest;
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "ens/ethereum.web3api.eth" */
interface Ethereum_Mutation_Input_deployContract extends Record<string, unknown> {
  abi: String;
  bytecode: String;
  args?: Array<String> | null;
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "ens/ethereum.web3api.eth" */
interface Ethereum_Mutation_Input_signMessage extends Record<string, unknown> {
  message: String;
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "ens/ethereum.web3api.eth" */
interface Ethereum_Mutation_Input_sendRPC extends Record<string, unknown> {
  method: String;
  params: Array<String>;
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "ens/ethereum.web3api.eth" */
export const Ethereum_Mutation = {
  callContractMethod: async (
    input: Ethereum_Mutation_Input_callContractMethod,
    client: Client
  ): Promise<InvokeApiResult<Types.Ethereum_TxResponse>> => {
    return client.invoke<Types.Ethereum_TxResponse>({
      uri: "ens/ethereum.web3api.eth",
      module: "mutation",
      method: "callContractMethod",
      input
    });
  },

  callContractMethodAndWait: async (
    input: Ethereum_Mutation_Input_callContractMethodAndWait,
    client: Client
  ): Promise<InvokeApiResult<Types.Ethereum_TxReceipt>> => {
    return client.invoke<Types.Ethereum_TxReceipt>({
      uri: "ens/ethereum.web3api.eth",
      module: "mutation",
      method: "callContractMethodAndWait",
      input
    });
  },

  sendTransaction: async (
    input: Ethereum_Mutation_Input_sendTransaction,
    client: Client
  ): Promise<InvokeApiResult<Types.Ethereum_TxResponse>> => {
    return client.invoke<Types.Ethereum_TxResponse>({
      uri: "ens/ethereum.web3api.eth",
      module: "mutation",
      method: "sendTransaction",
      input
    });
  },

  sendTransactionAndWait: async (
    input: Ethereum_Mutation_Input_sendTransactionAndWait,
    client: Client
  ): Promise<InvokeApiResult<Types.Ethereum_TxReceipt>> => {
    return client.invoke<Types.Ethereum_TxReceipt>({
      uri: "ens/ethereum.web3api.eth",
      module: "mutation",
      method: "sendTransactionAndWait",
      input
    });
  },

  deployContract: async (
    input: Ethereum_Mutation_Input_deployContract,
    client: Client
  ): Promise<InvokeApiResult<String>> => {
    return client.invoke<String>({
      uri: "ens/ethereum.web3api.eth",
      module: "mutation",
      method: "deployContract",
      input
    });
  },

  signMessage: async (
    input: Ethereum_Mutation_Input_signMessage,
    client: Client
  ): Promise<InvokeApiResult<String>> => {
    return client.invoke<String>({
      uri: "ens/ethereum.web3api.eth",
      module: "mutation",
      method: "signMessage",
      input
    });
  },

  sendRPC: async (
    input: Ethereum_Mutation_Input_sendRPC,
    client: Client
  ): Promise<InvokeApiResult<String | null>> => {
    return client.invoke<String | null>({
      uri: "ens/ethereum.web3api.eth",
      module: "mutation",
      method: "sendRPC",
      input
    });
  }
}

/// Imported Queries END ///

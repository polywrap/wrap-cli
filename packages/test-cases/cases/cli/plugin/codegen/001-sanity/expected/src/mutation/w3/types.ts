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
/// Envs END ///

/// Objects START ///
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

/* URI: "ens/ethereum.web3api.eth" */
export interface Ethereum_Access {
  address: Types.String;
  storageKeys: Array<Types.String>;
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


/// Imported Objects END ///

/// Imported Queries START ///

/* URI: "ens/ethereum.web3api.eth" */
interface Ethereum_Mutation_Input_callContractMethod extends Record<string, unknown> {
  address: Types.String;
  method: Types.String;
  args?: Array<Types.String> | null;
  connection?: Types.Ethereum_Connection | null;
  txOverrides?: Types.Ethereum_TxOverrides | null;
}

/* URI: "ens/ethereum.web3api.eth" */
interface Ethereum_Mutation_Input_callContractMethodAndWait extends Record<string, unknown> {
  address: Types.String;
  method: Types.String;
  args?: Array<Types.String> | null;
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
  abi: Types.String;
  bytecode: Types.String;
  args?: Array<Types.String> | null;
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "ens/ethereum.web3api.eth" */
interface Ethereum_Mutation_Input_signMessage extends Record<string, unknown> {
  message: Types.String;
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "ens/ethereum.web3api.eth" */
interface Ethereum_Mutation_Input_sendRPC extends Record<string, unknown> {
  method: Types.String;
  params: Array<Types.String>;
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
  ): Promise<InvokeApiResult<Types.String>> => {
    return client.invoke<Types.String>({
      uri: "ens/ethereum.web3api.eth",
      module: "mutation",
      method: "deployContract",
      input
    });
  },

  signMessage: async (
    input: Ethereum_Mutation_Input_signMessage,
    client: Client
  ): Promise<InvokeApiResult<Types.String>> => {
    return client.invoke<Types.String>({
      uri: "ens/ethereum.web3api.eth",
      module: "mutation",
      method: "signMessage",
      input
    });
  },

  sendRPC: async (
    input: Ethereum_Mutation_Input_sendRPC,
    client: Client
  ): Promise<InvokeApiResult<Types.String | null>> => {
    return client.invoke<Types.String | null>({
      uri: "ens/ethereum.web3api.eth",
      module: "mutation",
      method: "sendRPC",
      input
    });
  }
}

/// Imported Queries END ///

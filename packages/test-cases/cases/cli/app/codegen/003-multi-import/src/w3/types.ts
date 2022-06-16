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

/// Imported Objects START ///

/* URI: "w3://ens/ethereum.web3api.eth" */
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

/* URI: "w3://ens/ethereum.web3api.eth" */
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

/* URI: "w3://ens/ethereum.web3api.eth" */
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

/* URI: "w3://ens/ethereum.web3api.eth" */
export interface Ethereum_Access {
  address: Types.String;
  storageKeys: Array<Types.String>;
}

/* URI: "w3://ens/ethereum.web3api.eth" */
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

/* URI: "w3://ens/ethereum.web3api.eth" */
export interface Ethereum_TxOverrides {
  gasLimit?: Types.BigInt | null;
  gasPrice?: Types.BigInt | null;
  value?: Types.BigInt | null;
}

/* URI: "w3://ens/ethereum.web3api.eth" */
export interface Ethereum_StaticTxResult {
  result: Types.String;
  error: Types.Boolean;
}

/* URI: "w3://ens/ethereum.web3api.eth" */
export interface Ethereum_EventNotification {
  data: Types.String;
  address: Types.String;
  log: Types.Ethereum_Log;
}

/* URI: "w3://ens/ethereum.web3api.eth" */
export interface Ethereum_Connection {
  node?: Types.String | null;
  networkNameOrChainId?: Types.String | null;
}

/* URI: "w3://ens/ethereum.web3api.eth" */
export interface Ethereum_Network {
  name: Types.String;
  chainId: Types.BigInt;
  ensAddress?: Types.String | null;
}

/* URI: "w3://ipfs/QmeiPWHe2ixfitcgjRwP5AaJD5R7DbsGhQNQwT4rFNyxx8" */
export interface ERC20_Ethereum_Connection {
  node?: Types.String | null;
  networkNameOrChainId?: Types.String | null;
}

/* URI: "w3://ipfs/QmeiPWHe2ixfitcgjRwP5AaJD5R7DbsGhQNQwT4rFNyxx8" */
export interface ERC20_Ethereum_TxResponse {
  hash: Types.String;
  to?: Types.String | null;
  from: Types.String;
  nonce: Types.UInt32;
  gasLimit: Types.BigInt;
  gasPrice?: Types.BigInt | null;
  data: Types.String;
  value: Types.BigInt;
  chainId: Types.UInt32;
  blockNumber?: Types.BigInt | null;
  blockHash?: Types.String | null;
  timestamp?: Types.UInt32 | null;
  confirmations: Types.UInt32;
  raw?: Types.String | null;
  r?: Types.String | null;
  s?: Types.String | null;
  v?: Types.UInt32 | null;
  type?: Types.UInt32 | null;
  accessList?: Array<Types.ERC20_Ethereum_Access> | null;
}

/* URI: "w3://ipfs/QmeiPWHe2ixfitcgjRwP5AaJD5R7DbsGhQNQwT4rFNyxx8" */
export interface ERC20_Ethereum_Access {
  address: Types.String;
  storageKeys: Array<Types.String>;
}

/// Imported Objects END ///

/// Imported Queries START ///

/* URI: "w3://ens/ethereum.web3api.eth" */
interface Ethereum_Mutation_Input_callContractMethod extends Record<string, unknown> {
  address: Types.String;
  method: Types.String;
  args?: Array<Types.String> | null;
  connection?: Types.Ethereum_Connection | null;
  txOverrides?: Types.Ethereum_TxOverrides | null;
}

/* URI: "w3://ens/ethereum.web3api.eth" */
interface Ethereum_Mutation_Input_callContractMethodAndWait extends Record<string, unknown> {
  address: Types.String;
  method: Types.String;
  args?: Array<Types.String> | null;
  connection?: Types.Ethereum_Connection | null;
  txOverrides?: Types.Ethereum_TxOverrides | null;
}

/* URI: "w3://ens/ethereum.web3api.eth" */
interface Ethereum_Mutation_Input_sendTransaction extends Record<string, unknown> {
  tx: Types.Ethereum_TxRequest;
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "w3://ens/ethereum.web3api.eth" */
interface Ethereum_Mutation_Input_sendTransactionAndWait extends Record<string, unknown> {
  tx: Types.Ethereum_TxRequest;
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "w3://ens/ethereum.web3api.eth" */
interface Ethereum_Mutation_Input_deployContract extends Record<string, unknown> {
  abi: Types.String;
  bytecode: Types.String;
  args?: Array<Types.String> | null;
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "w3://ens/ethereum.web3api.eth" */
interface Ethereum_Mutation_Input_signMessage extends Record<string, unknown> {
  message: Types.String;
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "w3://ens/ethereum.web3api.eth" */
interface Ethereum_Mutation_Input_sendRPC extends Record<string, unknown> {
  method: Types.String;
  params: Array<Types.String>;
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "w3://ens/ethereum.web3api.eth" */
export const Ethereum_Mutation = {
  callContractMethod: async (
    input: Ethereum_Mutation_Input_callContractMethod,
    client: Client,
    uri: string = "w3://ens/ethereum.web3api.eth"
  ): Promise<InvokeApiResult<Types.Ethereum_TxResponse>> => {
    return client.invoke<Types.Ethereum_TxResponse>({
      uri,
      module: "mutation",
      method: "callContractMethod",
      input
    });
  },

  callContractMethodAndWait: async (
    input: Ethereum_Mutation_Input_callContractMethodAndWait,
    client: Client,
    uri: string = "w3://ens/ethereum.web3api.eth"
  ): Promise<InvokeApiResult<Types.Ethereum_TxReceipt>> => {
    return client.invoke<Types.Ethereum_TxReceipt>({
      uri,
      module: "mutation",
      method: "callContractMethodAndWait",
      input
    });
  },

  sendTransaction: async (
    input: Ethereum_Mutation_Input_sendTransaction,
    client: Client,
    uri: string = "w3://ens/ethereum.web3api.eth"
  ): Promise<InvokeApiResult<Types.Ethereum_TxResponse>> => {
    return client.invoke<Types.Ethereum_TxResponse>({
      uri,
      module: "mutation",
      method: "sendTransaction",
      input
    });
  },

  sendTransactionAndWait: async (
    input: Ethereum_Mutation_Input_sendTransactionAndWait,
    client: Client,
    uri: string = "w3://ens/ethereum.web3api.eth"
  ): Promise<InvokeApiResult<Types.Ethereum_TxReceipt>> => {
    return client.invoke<Types.Ethereum_TxReceipt>({
      uri,
      module: "mutation",
      method: "sendTransactionAndWait",
      input
    });
  },

  deployContract: async (
    input: Ethereum_Mutation_Input_deployContract,
    client: Client,
    uri: string = "w3://ens/ethereum.web3api.eth"
  ): Promise<InvokeApiResult<Types.String>> => {
    return client.invoke<Types.String>({
      uri,
      module: "mutation",
      method: "deployContract",
      input
    });
  },

  signMessage: async (
    input: Ethereum_Mutation_Input_signMessage,
    client: Client,
    uri: string = "w3://ens/ethereum.web3api.eth"
  ): Promise<InvokeApiResult<Types.String>> => {
    return client.invoke<Types.String>({
      uri,
      module: "mutation",
      method: "signMessage",
      input
    });
  },

  sendRPC: async (
    input: Ethereum_Mutation_Input_sendRPC,
    client: Client,
    uri: string = "w3://ens/ethereum.web3api.eth"
  ): Promise<InvokeApiResult<Types.String | null>> => {
    return client.invoke<Types.String | null>({
      uri,
      module: "mutation",
      method: "sendRPC",
      input
    });
  }
}

/* URI: "w3://ens/ethereum.web3api.eth" */
interface Ethereum_Query_Input_callContractView extends Record<string, unknown> {
  address: Types.String;
  method: Types.String;
  args?: Array<Types.String> | null;
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "w3://ens/ethereum.web3api.eth" */
interface Ethereum_Query_Input_callContractStatic extends Record<string, unknown> {
  address: Types.String;
  method: Types.String;
  args?: Array<Types.String> | null;
  connection?: Types.Ethereum_Connection | null;
  txOverrides?: Types.Ethereum_TxOverrides | null;
}

/* URI: "w3://ens/ethereum.web3api.eth" */
interface Ethereum_Query_Input_getBalance extends Record<string, unknown> {
  address: Types.String;
  blockTag?: Types.BigInt | null;
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "w3://ens/ethereum.web3api.eth" */
interface Ethereum_Query_Input_encodeParams extends Record<string, unknown> {
  types: Array<Types.String>;
  values: Array<Types.String>;
}

/* URI: "w3://ens/ethereum.web3api.eth" */
interface Ethereum_Query_Input_encodeFunction extends Record<string, unknown> {
  method: Types.String;
  args?: Array<Types.String> | null;
}

/* URI: "w3://ens/ethereum.web3api.eth" */
interface Ethereum_Query_Input_solidityPack extends Record<string, unknown> {
  types: Array<Types.String>;
  values: Array<Types.String>;
}

/* URI: "w3://ens/ethereum.web3api.eth" */
interface Ethereum_Query_Input_solidityKeccak256 extends Record<string, unknown> {
  types: Array<Types.String>;
  values: Array<Types.String>;
}

/* URI: "w3://ens/ethereum.web3api.eth" */
interface Ethereum_Query_Input_soliditySha256 extends Record<string, unknown> {
  types: Array<Types.String>;
  values: Array<Types.String>;
}

/* URI: "w3://ens/ethereum.web3api.eth" */
interface Ethereum_Query_Input_getSignerAddress extends Record<string, unknown> {
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "w3://ens/ethereum.web3api.eth" */
interface Ethereum_Query_Input_getSignerBalance extends Record<string, unknown> {
  blockTag?: Types.BigInt | null;
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "w3://ens/ethereum.web3api.eth" */
interface Ethereum_Query_Input_getSignerTransactionCount extends Record<string, unknown> {
  blockTag?: Types.BigInt | null;
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "w3://ens/ethereum.web3api.eth" */
interface Ethereum_Query_Input_getGasPrice extends Record<string, unknown> {
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "w3://ens/ethereum.web3api.eth" */
interface Ethereum_Query_Input_estimateTransactionGas extends Record<string, unknown> {
  tx: Types.Ethereum_TxRequest;
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "w3://ens/ethereum.web3api.eth" */
interface Ethereum_Query_Input_estimateContractCallGas extends Record<string, unknown> {
  address: Types.String;
  method: Types.String;
  args?: Array<Types.String> | null;
  connection?: Types.Ethereum_Connection | null;
  txOverrides?: Types.Ethereum_TxOverrides | null;
}

/* URI: "w3://ens/ethereum.web3api.eth" */
interface Ethereum_Query_Input_checkAddress extends Record<string, unknown> {
  address: Types.String;
}

/* URI: "w3://ens/ethereum.web3api.eth" */
interface Ethereum_Query_Input_toWei extends Record<string, unknown> {
  eth: Types.String;
}

/* URI: "w3://ens/ethereum.web3api.eth" */
interface Ethereum_Query_Input_toEth extends Record<string, unknown> {
  wei: Types.BigInt;
}

/* URI: "w3://ens/ethereum.web3api.eth" */
interface Ethereum_Query_Input_awaitTransaction extends Record<string, unknown> {
  txHash: Types.String;
  confirmations: Types.UInt32;
  timeout: Types.UInt32;
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "w3://ens/ethereum.web3api.eth" */
interface Ethereum_Query_Input_waitForEvent extends Record<string, unknown> {
  address: Types.String;
  event: Types.String;
  args?: Array<Types.String> | null;
  timeout?: Types.UInt32 | null;
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "w3://ens/ethereum.web3api.eth" */
interface Ethereum_Query_Input_getNetwork extends Record<string, unknown> {
  connection?: Types.Ethereum_Connection | null;
}

/* URI: "w3://ens/ethereum.web3api.eth" */
export const Ethereum_Query = {
  callContractView: async (
    input: Ethereum_Query_Input_callContractView,
    client: Client,
    uri: string = "w3://ens/ethereum.web3api.eth"
  ): Promise<InvokeApiResult<Types.String>> => {
    return client.invoke<Types.String>({
      uri,
      module: "query",
      method: "callContractView",
      input
    });
  },

  callContractStatic: async (
    input: Ethereum_Query_Input_callContractStatic,
    client: Client,
    uri: string = "w3://ens/ethereum.web3api.eth"
  ): Promise<InvokeApiResult<Types.Ethereum_StaticTxResult>> => {
    return client.invoke<Types.Ethereum_StaticTxResult>({
      uri,
      module: "query",
      method: "callContractStatic",
      input
    });
  },

  getBalance: async (
    input: Ethereum_Query_Input_getBalance,
    client: Client,
    uri: string = "w3://ens/ethereum.web3api.eth"
  ): Promise<InvokeApiResult<Types.BigInt>> => {
    return client.invoke<Types.BigInt>({
      uri,
      module: "query",
      method: "getBalance",
      input
    });
  },

  encodeParams: async (
    input: Ethereum_Query_Input_encodeParams,
    client: Client,
    uri: string = "w3://ens/ethereum.web3api.eth"
  ): Promise<InvokeApiResult<Types.String>> => {
    return client.invoke<Types.String>({
      uri,
      module: "query",
      method: "encodeParams",
      input
    });
  },

  encodeFunction: async (
    input: Ethereum_Query_Input_encodeFunction,
    client: Client,
    uri: string = "w3://ens/ethereum.web3api.eth"
  ): Promise<InvokeApiResult<Types.String>> => {
    return client.invoke<Types.String>({
      uri,
      module: "query",
      method: "encodeFunction",
      input
    });
  },

  solidityPack: async (
    input: Ethereum_Query_Input_solidityPack,
    client: Client,
    uri: string = "w3://ens/ethereum.web3api.eth"
  ): Promise<InvokeApiResult<Types.String>> => {
    return client.invoke<Types.String>({
      uri,
      module: "query",
      method: "solidityPack",
      input
    });
  },

  solidityKeccak256: async (
    input: Ethereum_Query_Input_solidityKeccak256,
    client: Client,
    uri: string = "w3://ens/ethereum.web3api.eth"
  ): Promise<InvokeApiResult<Types.String>> => {
    return client.invoke<Types.String>({
      uri,
      module: "query",
      method: "solidityKeccak256",
      input
    });
  },

  soliditySha256: async (
    input: Ethereum_Query_Input_soliditySha256,
    client: Client,
    uri: string = "w3://ens/ethereum.web3api.eth"
  ): Promise<InvokeApiResult<Types.String>> => {
    return client.invoke<Types.String>({
      uri,
      module: "query",
      method: "soliditySha256",
      input
    });
  },

  getSignerAddress: async (
    input: Ethereum_Query_Input_getSignerAddress,
    client: Client,
    uri: string = "w3://ens/ethereum.web3api.eth"
  ): Promise<InvokeApiResult<Types.String>> => {
    return client.invoke<Types.String>({
      uri,
      module: "query",
      method: "getSignerAddress",
      input
    });
  },

  getSignerBalance: async (
    input: Ethereum_Query_Input_getSignerBalance,
    client: Client,
    uri: string = "w3://ens/ethereum.web3api.eth"
  ): Promise<InvokeApiResult<Types.BigInt>> => {
    return client.invoke<Types.BigInt>({
      uri,
      module: "query",
      method: "getSignerBalance",
      input
    });
  },

  getSignerTransactionCount: async (
    input: Ethereum_Query_Input_getSignerTransactionCount,
    client: Client,
    uri: string = "w3://ens/ethereum.web3api.eth"
  ): Promise<InvokeApiResult<Types.BigInt>> => {
    return client.invoke<Types.BigInt>({
      uri,
      module: "query",
      method: "getSignerTransactionCount",
      input
    });
  },

  getGasPrice: async (
    input: Ethereum_Query_Input_getGasPrice,
    client: Client,
    uri: string = "w3://ens/ethereum.web3api.eth"
  ): Promise<InvokeApiResult<Types.BigInt>> => {
    return client.invoke<Types.BigInt>({
      uri,
      module: "query",
      method: "getGasPrice",
      input
    });
  },

  estimateTransactionGas: async (
    input: Ethereum_Query_Input_estimateTransactionGas,
    client: Client,
    uri: string = "w3://ens/ethereum.web3api.eth"
  ): Promise<InvokeApiResult<Types.BigInt>> => {
    return client.invoke<Types.BigInt>({
      uri,
      module: "query",
      method: "estimateTransactionGas",
      input
    });
  },

  estimateContractCallGas: async (
    input: Ethereum_Query_Input_estimateContractCallGas,
    client: Client,
    uri: string = "w3://ens/ethereum.web3api.eth"
  ): Promise<InvokeApiResult<Types.BigInt>> => {
    return client.invoke<Types.BigInt>({
      uri,
      module: "query",
      method: "estimateContractCallGas",
      input
    });
  },

  checkAddress: async (
    input: Ethereum_Query_Input_checkAddress,
    client: Client,
    uri: string = "w3://ens/ethereum.web3api.eth"
  ): Promise<InvokeApiResult<Types.Boolean>> => {
    return client.invoke<Types.Boolean>({
      uri,
      module: "query",
      method: "checkAddress",
      input
    });
  },

  toWei: async (
    input: Ethereum_Query_Input_toWei,
    client: Client,
    uri: string = "w3://ens/ethereum.web3api.eth"
  ): Promise<InvokeApiResult<Types.BigInt>> => {
    return client.invoke<Types.BigInt>({
      uri,
      module: "query",
      method: "toWei",
      input
    });
  },

  toEth: async (
    input: Ethereum_Query_Input_toEth,
    client: Client,
    uri: string = "w3://ens/ethereum.web3api.eth"
  ): Promise<InvokeApiResult<Types.String>> => {
    return client.invoke<Types.String>({
      uri,
      module: "query",
      method: "toEth",
      input
    });
  },

  awaitTransaction: async (
    input: Ethereum_Query_Input_awaitTransaction,
    client: Client,
    uri: string = "w3://ens/ethereum.web3api.eth"
  ): Promise<InvokeApiResult<Types.Ethereum_TxReceipt>> => {
    return client.invoke<Types.Ethereum_TxReceipt>({
      uri,
      module: "query",
      method: "awaitTransaction",
      input
    });
  },

  waitForEvent: async (
    input: Ethereum_Query_Input_waitForEvent,
    client: Client,
    uri: string = "w3://ens/ethereum.web3api.eth"
  ): Promise<InvokeApiResult<Types.Ethereum_EventNotification>> => {
    return client.invoke<Types.Ethereum_EventNotification>({
      uri,
      module: "query",
      method: "waitForEvent",
      input
    });
  },

  getNetwork: async (
    input: Ethereum_Query_Input_getNetwork,
    client: Client,
    uri: string = "w3://ens/ethereum.web3api.eth"
  ): Promise<InvokeApiResult<Types.Ethereum_Network>> => {
    return client.invoke<Types.Ethereum_Network>({
      uri,
      module: "query",
      method: "getNetwork",
      input
    });
  }
}

/* URI: "w3://ipfs/QmVGwj3FtvhiErJ1wWbmRuHpvEQ3t1BPNESvEiMJM57p2y" */
interface Console_Query_Input_debug extends Record<string, unknown> {
  message: Types.String;
}

/* URI: "w3://ipfs/QmVGwj3FtvhiErJ1wWbmRuHpvEQ3t1BPNESvEiMJM57p2y" */
interface Console_Query_Input_info extends Record<string, unknown> {
  message: Types.String;
}

/* URI: "w3://ipfs/QmVGwj3FtvhiErJ1wWbmRuHpvEQ3t1BPNESvEiMJM57p2y" */
interface Console_Query_Input_warn extends Record<string, unknown> {
  message: Types.String;
}

/* URI: "w3://ipfs/QmVGwj3FtvhiErJ1wWbmRuHpvEQ3t1BPNESvEiMJM57p2y" */
interface Console_Query_Input_error extends Record<string, unknown> {
  message: Types.String;
}

/* URI: "w3://ipfs/QmVGwj3FtvhiErJ1wWbmRuHpvEQ3t1BPNESvEiMJM57p2y" */
export const Console_Query = {
  debug: async (
    input: Console_Query_Input_debug,
    client: Client,
    uri: string = "w3://ipfs/QmVGwj3FtvhiErJ1wWbmRuHpvEQ3t1BPNESvEiMJM57p2y"
  ): Promise<InvokeApiResult<Types.Boolean>> => {
    return client.invoke<Types.Boolean>({
      uri,
      module: "query",
      method: "debug",
      input
    });
  },

  info: async (
    input: Console_Query_Input_info,
    client: Client,
    uri: string = "w3://ipfs/QmVGwj3FtvhiErJ1wWbmRuHpvEQ3t1BPNESvEiMJM57p2y"
  ): Promise<InvokeApiResult<Types.Boolean>> => {
    return client.invoke<Types.Boolean>({
      uri,
      module: "query",
      method: "info",
      input
    });
  },

  warn: async (
    input: Console_Query_Input_warn,
    client: Client,
    uri: string = "w3://ipfs/QmVGwj3FtvhiErJ1wWbmRuHpvEQ3t1BPNESvEiMJM57p2y"
  ): Promise<InvokeApiResult<Types.Boolean>> => {
    return client.invoke<Types.Boolean>({
      uri,
      module: "query",
      method: "warn",
      input
    });
  },

  error: async (
    input: Console_Query_Input_error,
    client: Client,
    uri: string = "w3://ipfs/QmVGwj3FtvhiErJ1wWbmRuHpvEQ3t1BPNESvEiMJM57p2y"
  ): Promise<InvokeApiResult<Types.Boolean>> => {
    return client.invoke<Types.Boolean>({
      uri,
      module: "query",
      method: "error",
      input
    });
  }
}

/* URI: "w3://ipfs/QmeiPWHe2ixfitcgjRwP5AaJD5R7DbsGhQNQwT4rFNyxx8" */
interface ERC20_Mutation_Input_transfer extends Record<string, unknown> {
  connection?: Types.ERC20_Ethereum_Connection | null;
  address: Types.String;
  recipient: Types.String;
  amount: Types.BigInt;
}

/* URI: "w3://ipfs/QmeiPWHe2ixfitcgjRwP5AaJD5R7DbsGhQNQwT4rFNyxx8" */
interface ERC20_Mutation_Input_approve extends Record<string, unknown> {
  connection?: Types.ERC20_Ethereum_Connection | null;
  address: Types.String;
  spender: Types.String;
  amount: Types.BigInt;
}

/* URI: "w3://ipfs/QmeiPWHe2ixfitcgjRwP5AaJD5R7DbsGhQNQwT4rFNyxx8" */
interface ERC20_Mutation_Input_transferFrom extends Record<string, unknown> {
  connection?: Types.ERC20_Ethereum_Connection | null;
  address: Types.String;
  sender: Types.String;
  recipient: Types.String;
  amount: Types.BigInt;
}

/* URI: "w3://ipfs/QmeiPWHe2ixfitcgjRwP5AaJD5R7DbsGhQNQwT4rFNyxx8" */
interface ERC20_Mutation_Input_increaseAllowance extends Record<string, unknown> {
  connection?: Types.ERC20_Ethereum_Connection | null;
  address: Types.String;
  spender: Types.String;
  addedValue: Types.BigInt;
}

/* URI: "w3://ipfs/QmeiPWHe2ixfitcgjRwP5AaJD5R7DbsGhQNQwT4rFNyxx8" */
interface ERC20_Mutation_Input_decreaseAllowance extends Record<string, unknown> {
  connection?: Types.ERC20_Ethereum_Connection | null;
  address: Types.String;
  spender: Types.String;
  subtractedValue: Types.BigInt;
}

/* URI: "w3://ipfs/QmeiPWHe2ixfitcgjRwP5AaJD5R7DbsGhQNQwT4rFNyxx8" */
export const ERC20_Mutation = {
  transfer: async (
    input: ERC20_Mutation_Input_transfer,
    client: Client,
    uri: string = "w3://ipfs/QmeiPWHe2ixfitcgjRwP5AaJD5R7DbsGhQNQwT4rFNyxx8"
  ): Promise<InvokeApiResult<Types.ERC20_Ethereum_TxResponse>> => {
    return client.invoke<Types.ERC20_Ethereum_TxResponse>({
      uri,
      module: "mutation",
      method: "transfer",
      input
    });
  },

  approve: async (
    input: ERC20_Mutation_Input_approve,
    client: Client,
    uri: string = "w3://ipfs/QmeiPWHe2ixfitcgjRwP5AaJD5R7DbsGhQNQwT4rFNyxx8"
  ): Promise<InvokeApiResult<Types.ERC20_Ethereum_TxResponse>> => {
    return client.invoke<Types.ERC20_Ethereum_TxResponse>({
      uri,
      module: "mutation",
      method: "approve",
      input
    });
  },

  transferFrom: async (
    input: ERC20_Mutation_Input_transferFrom,
    client: Client,
    uri: string = "w3://ipfs/QmeiPWHe2ixfitcgjRwP5AaJD5R7DbsGhQNQwT4rFNyxx8"
  ): Promise<InvokeApiResult<Types.ERC20_Ethereum_TxResponse>> => {
    return client.invoke<Types.ERC20_Ethereum_TxResponse>({
      uri,
      module: "mutation",
      method: "transferFrom",
      input
    });
  },

  increaseAllowance: async (
    input: ERC20_Mutation_Input_increaseAllowance,
    client: Client,
    uri: string = "w3://ipfs/QmeiPWHe2ixfitcgjRwP5AaJD5R7DbsGhQNQwT4rFNyxx8"
  ): Promise<InvokeApiResult<Types.ERC20_Ethereum_TxResponse>> => {
    return client.invoke<Types.ERC20_Ethereum_TxResponse>({
      uri,
      module: "mutation",
      method: "increaseAllowance",
      input
    });
  },

  decreaseAllowance: async (
    input: ERC20_Mutation_Input_decreaseAllowance,
    client: Client,
    uri: string = "w3://ipfs/QmeiPWHe2ixfitcgjRwP5AaJD5R7DbsGhQNQwT4rFNyxx8"
  ): Promise<InvokeApiResult<Types.ERC20_Ethereum_TxResponse>> => {
    return client.invoke<Types.ERC20_Ethereum_TxResponse>({
      uri,
      module: "mutation",
      method: "decreaseAllowance",
      input
    });
  }
}

/* URI: "w3://ipfs/QmeiPWHe2ixfitcgjRwP5AaJD5R7DbsGhQNQwT4rFNyxx8" */
interface ERC20_Query_Input_name extends Record<string, unknown> {
  connection?: Types.ERC20_Ethereum_Connection | null;
  address: Types.String;
}

/* URI: "w3://ipfs/QmeiPWHe2ixfitcgjRwP5AaJD5R7DbsGhQNQwT4rFNyxx8" */
interface ERC20_Query_Input_symbol extends Record<string, unknown> {
  connection?: Types.ERC20_Ethereum_Connection | null;
  address: Types.String;
}

/* URI: "w3://ipfs/QmeiPWHe2ixfitcgjRwP5AaJD5R7DbsGhQNQwT4rFNyxx8" */
interface ERC20_Query_Input_decimals extends Record<string, unknown> {
  connection?: Types.ERC20_Ethereum_Connection | null;
  address: Types.String;
}

/* URI: "w3://ipfs/QmeiPWHe2ixfitcgjRwP5AaJD5R7DbsGhQNQwT4rFNyxx8" */
interface ERC20_Query_Input_totalSupply extends Record<string, unknown> {
  connection?: Types.ERC20_Ethereum_Connection | null;
  address: Types.String;
}

/* URI: "w3://ipfs/QmeiPWHe2ixfitcgjRwP5AaJD5R7DbsGhQNQwT4rFNyxx8" */
interface ERC20_Query_Input_balanceOf extends Record<string, unknown> {
  connection?: Types.ERC20_Ethereum_Connection | null;
  address: Types.String;
  account: Types.String;
}

/* URI: "w3://ipfs/QmeiPWHe2ixfitcgjRwP5AaJD5R7DbsGhQNQwT4rFNyxx8" */
interface ERC20_Query_Input_allowance extends Record<string, unknown> {
  connection?: Types.ERC20_Ethereum_Connection | null;
  address: Types.String;
  owner: Types.String;
  spender: Types.String;
}

/* URI: "w3://ipfs/QmeiPWHe2ixfitcgjRwP5AaJD5R7DbsGhQNQwT4rFNyxx8" */
export const ERC20_Query = {
  name: async (
    input: ERC20_Query_Input_name,
    client: Client,
    uri: string = "w3://ipfs/QmeiPWHe2ixfitcgjRwP5AaJD5R7DbsGhQNQwT4rFNyxx8"
  ): Promise<InvokeApiResult<Types.String>> => {
    return client.invoke<Types.String>({
      uri,
      module: "query",
      method: "name",
      input
    });
  },

  symbol: async (
    input: ERC20_Query_Input_symbol,
    client: Client,
    uri: string = "w3://ipfs/QmeiPWHe2ixfitcgjRwP5AaJD5R7DbsGhQNQwT4rFNyxx8"
  ): Promise<InvokeApiResult<Types.String>> => {
    return client.invoke<Types.String>({
      uri,
      module: "query",
      method: "symbol",
      input
    });
  },

  decimals: async (
    input: ERC20_Query_Input_decimals,
    client: Client,
    uri: string = "w3://ipfs/QmeiPWHe2ixfitcgjRwP5AaJD5R7DbsGhQNQwT4rFNyxx8"
  ): Promise<InvokeApiResult<Types.Int>> => {
    return client.invoke<Types.Int>({
      uri,
      module: "query",
      method: "decimals",
      input
    });
  },

  totalSupply: async (
    input: ERC20_Query_Input_totalSupply,
    client: Client,
    uri: string = "w3://ipfs/QmeiPWHe2ixfitcgjRwP5AaJD5R7DbsGhQNQwT4rFNyxx8"
  ): Promise<InvokeApiResult<Types.BigInt>> => {
    return client.invoke<Types.BigInt>({
      uri,
      module: "query",
      method: "totalSupply",
      input
    });
  },

  balanceOf: async (
    input: ERC20_Query_Input_balanceOf,
    client: Client,
    uri: string = "w3://ipfs/QmeiPWHe2ixfitcgjRwP5AaJD5R7DbsGhQNQwT4rFNyxx8"
  ): Promise<InvokeApiResult<Types.BigInt>> => {
    return client.invoke<Types.BigInt>({
      uri,
      module: "query",
      method: "balanceOf",
      input
    });
  },

  allowance: async (
    input: ERC20_Query_Input_allowance,
    client: Client,
    uri: string = "w3://ipfs/QmeiPWHe2ixfitcgjRwP5AaJD5R7DbsGhQNQwT4rFNyxx8"
  ): Promise<InvokeApiResult<Types.BigInt>> => {
    return client.invoke<Types.BigInt>({
      uri,
      module: "query",
      method: "allowance",
      input
    });
  }
}

/// Imported Queries END ///

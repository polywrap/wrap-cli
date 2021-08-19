/* eslint-disable @typescript-eslint/naming-convention */

// TODO: generated types here from the schema.graphql to ensure safety `Resolvers<TQuery, TMutation>`
// https://github.com/web3-api/monorepo/issues/101
import { PluginModule, Client } from "@web3api/core-js";

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
export type String = string;
export type Boolean = boolean;

/// Objects

export interface TxReceipt {
  to: string;
  from: string;
  contractAddress: string;
  transactionIndex: UInt32;
  root?: string;
  gasUsed: BigInt;
  logsBloom: string;
  transactionHash: string;
  logs: Log[];
  blockNumber: BigInt;
  blockHash: string;
  confirmations: UInt32;
  cumulativeGasUsed: BigInt;
  effectiveGasPrice: BigInt;
  byzantium: boolean;
  type: UInt32;
  status?: UInt32;
}

export interface TxResponse {
  hash: string;
  to?: string;
  from: string;
  nonce: UInt32;
  gasLimit: BigInt;
  gasPrice?: BigInt;
  data: string;
  value: BigInt;
  chainId: UInt32;
  blockNumber?: BigInt;
  blockHash?: string;
  timestamp?: UInt32;
  confirmations: UInt32;
  raw?: string;
  r?: string;
  s?: string;
  v?: UInt32;
  type?: UInt32;
  accessList?: Access[];
}

export interface TxRequest {
  to?: string;
  from?: string;
  nonce?: UInt32;
  gasLimit?: BigInt;
  gasPrice?: BigInt;
  data?: string;
  value?: BigInt;
  chainId?: UInt32;
  type?: UInt32;
}

export interface TxOverrides {
  gasLimit?: BigInt;
  gasPrice?: BigInt;
  value?: BigInt;
}

export interface StaticTxResult {
  result: string;
  error: boolean;
}

export interface Log {
  blockNumber: BigInt;
  blockHash: string;
  transactionIndex: UInt32;
  removed: boolean;
  address: string;
  data: string;
  topics: string[];
  transactionHash: string;
  logIndex: UInt32;
}

export interface EventNotification {
  data: string;
  address: string;
  log: Log;
}

export interface Access {
  address: string;
  storageKeys: string[];
}

export interface Connection {
  node?: string;
  networkNameOrChainId?: string;
}

/// Queries

export interface Input_callContractView extends Record<string, unknown> {
  address: string;
  method: string;
  args?: string[];
  connection?: Connection;
}

export interface Input_callContractStatic extends Record<string, unknown> {
  address: string;
  method: string;
  args?: string[];
  connection?: Connection;
  txOverrides?: TxOverrides;
}

export interface Input_encodeParams extends Record<string, unknown> {
  types: string[];
  values: string[];
}

export interface Input_getSignerAddress extends Record<string, unknown> {
  connection?: Connection;
}

export interface Input_getSignerBalance extends Record<string, unknown> {
  blockTag?: BigInt;
  connection?: Connection;
}

export interface Input_getSignerTransactionCount
  extends Record<string, unknown> {
  blockTag?: BigInt;
  connection?: Connection;
}

export interface Input_getGasPrice extends Record<string, unknown> {
  connection?: Connection;
}

export interface Input_estimateTransactionGas extends Record<string, unknown> {
  tx: TxRequest;
  connection?: Connection;
}

export interface Input_estimateContractCallGas extends Record<string, unknown> {
  address: string;
  method: string;
  args?: string[];
  connection?: Connection;
  txOverrides?: TxOverrides;
}

export interface Input_checkAddress extends Record<string, unknown> {
  address: string;
}

export interface Input_toWei extends Record<string, unknown> {
  eth: string;
}

export interface Input_toEth extends Record<string, unknown> {
  wei: BigInt;
}

export interface Input_awaitTransaction extends Record<string, unknown> {
  txHash: string;
  confirmations: UInt32;
  timeout: UInt32;
  connection?: Connection;
}

export interface Input_waitForEvent extends Record<string, unknown> {
  address: string;
  event: string;
  args?: string[];
  timeout?: UInt32;
  connection?: Connection;
}

export interface Query extends PluginModule {
  callContractView(
    input: Input_callContractView,
    client: Client
  ): Promise<string>;

  callContractStatic(
    input: Input_callContractStatic,
    client: Client
  ): Promise<StaticTxResult>;

  encodeParams(input: Input_encodeParams, client: Client): Promise<string>;

  getSignerAddress(
    input: Input_getSignerAddress,
    client: Client
  ): Promise<string>;

  getSignerBalance(
    input: Input_getSignerBalance,
    client: Client
  ): Promise<BigInt>;

  getSignerTransactionCount(
    input: Input_getSignerTransactionCount,
    client: Client
  ): Promise<BigInt>;

  getGasPrice(input: Input_getGasPrice, client: Client): Promise<BigInt>;

  estimateTransactionGas(
    input: Input_estimateTransactionGas,
    client: Client
  ): Promise<BigInt>;

  estimateContractCallGas(
    input: Input_estimateContractCallGas,
    client: Client
  ): Promise<BigInt>;

  checkAddress(input: Input_checkAddress, client: Client): Promise<boolean>;

  toWei(input: Input_toWei, client: Client): Promise<BigInt>;

  toEth(input: Input_toEth, client: Client): Promise<string>;

  awaitTransaction(
    input: Input_awaitTransaction,
    client: Client
  ): Promise<TxReceipt>;

  waitForEvent(
    input: Input_waitForEvent,
    client: Client
  ): Promise<EventNotification>;
}

export interface Input_callContractMethod extends Record<string, unknown> {
  address: string;
  method: string;
  args?: string[];
  connection?: Connection;
  txOverrides?: TxOverrides;
}

export interface Input_callContractMethodAndWait
  extends Record<string, unknown> {
  address: string;
  method: string;
  args?: string[];
  connection?: Connection;
  txOverrides?: TxOverrides;
}

export interface Input_sendTransaction extends Record<string, unknown> {
  tx: TxRequest;
  connection?: Connection;
}

export interface Input_sendTransactionAndWait extends Record<string, unknown> {
  tx: TxRequest;
  connection?: Connection;
}

export interface Input_deployContract extends Record<string, unknown> {
  abi: string;
  bytecode: string;
  args?: string[];
  connection?: Connection;
}

export interface Input_signMessage extends Record<string, unknown> {
  message: string;
  connection?: Connection;
}

export interface Input_sendRPC extends Record<string, unknown> {
  method: string;
  params: string[];
  connection?: Connection;
}

export interface Mutation extends PluginModule {
  callContractMethod(
    input: Input_callContractMethod,
    client: Client
  ): Promise<TxResponse>;

  callContractMethodAndWait(
    input: Input_callContractMethodAndWait,
    client: Client
  ): Promise<TxReceipt>;

  sendTransaction(
    input: Input_sendTransaction,
    client: Client
  ): Promise<TxResponse>;

  sendTransactionAndWait(
    input: Input_sendTransactionAndWait,
    client: Client
  ): Promise<TxReceipt>;

  deployContract(input: Input_deployContract, client: Client): Promise<string>;

  signMessage(input: Input_signMessage, client: Client): Promise<string>;

  sendRPC(input: Input_sendRPC, client: Client): Promise<string>;
}

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */

import * as Types from "./";

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

export interface TxReceipt {
  to: string;
  from: string;
  contractAddress: string;
  transactionIndex: UInt32;
  root?: string | null;
  gasUsed: BigInt;
  logsBloom: string;
  transactionHash: string;
  logs: Array<Types.Log>;
  blockNumber: BigInt;
  blockHash: string;
  confirmations: UInt32;
  cumulativeGasUsed: BigInt;
  effectiveGasPrice: BigInt;
  byzantium: boolean;
  type: UInt32;
  status?: UInt32 | null;
}

export interface TxResponse {
  hash: string;
  to?: string | null;
  from: string;
  nonce: UInt32;
  gasLimit: BigInt;
  gasPrice?: BigInt | null;
  data: string;
  value: BigInt;
  chainId: BigInt;
  blockNumber?: BigInt | null;
  blockHash?: string | null;
  timestamp?: UInt32 | null;
  confirmations: UInt32;
  raw?: string | null;
  r?: string | null;
  s?: string | null;
  v?: UInt32 | null;
  type?: UInt32 | null;
  accessList?: Array<Types.Access> | null;
}

export interface TxRequest {
  to?: string | null;
  from?: string | null;
  nonce?: UInt32 | null;
  gasLimit?: BigInt | null;
  gasPrice?: BigInt | null;
  data?: string | null;
  value?: BigInt | null;
  chainId?: BigInt | null;
  type?: UInt32 | null;
}

export interface TxOverrides {
  gasLimit?: BigInt | null;
  gasPrice?: BigInt | null;
  value?: BigInt | null;
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
  topics: Array<string>;
  transactionHash: string;
  logIndex: UInt32;
}

export interface EventNotification {
  data: string;
  address: string;
  log: Types.Log;
}

export interface Access {
  address: string;
  storageKeys: Array<string>;
}

export interface Connection {
  node?: string | null;
  networkNameOrChainId?: string | null;
}

export interface Network {
  name: string;
  chainId: BigInt;
  ensAddress?: string | null;
}

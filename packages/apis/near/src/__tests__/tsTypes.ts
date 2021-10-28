// @ts-noCheck
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

export interface PublicKey {
  keyType: Types.KeyType;
  data: Bytes;
}

export interface AccessKeyPermission {
  _?: String | null;
}

export interface FullAccessPermission {
  _?: String | null;
}

export interface FunctionCallPermission {
  receiverId: String;
  methodNames: Array<String>;
  allowance?: BigInt | null;
  _?: String | null;
}

export interface AccessKey {
  nonce: BigInt;
  permission: Types.AccessKeyPermission;
}

export interface AccessKeyInfo {
  publicKey: Types.PublicKey;
  accessKey: Types.AccessKey;
}

export interface Action {
  _?: String | null;
}

export type ActionUnion =
  | CreateAccount
  | DeployContract
  | FunctionCall
  | Transfer
  | Stake
  | AddKey
  | DeleteKey
  | DeleteAccount;

export type AccessKeyPermissionUnion = FunctionCallPermission | FullAccessPermission;

export interface CreateAccount {
  _?: String | null;
}

export interface DeployContract {
  code: Bytes;
  _?: String | null;
}

export interface FunctionCall {
  methodName: String;
  args: Bytes;
  gas: BigInt;
  deposit: BigInt;
  _?: String | null;
}

export interface Transfer {
  deposit: BigInt;
  _?: String | null;
}

export interface Stake {
  stake: BigInt;
  publicKey: Types.PublicKey;
  _?: String | null;
}

export interface AddKey {
  publicKey: Types.PublicKey;
  accessKey: Types.AccessKey;
  _?: String | null;
}

export interface DeleteKey {
  publicKey: Types.PublicKey;
  _?: String | null;
}

export interface DeleteAccount {
  beneficiaryId: String;
  _?: String | null;
}

export interface Transaction {
  signerId: String;
  publicKey: Types.PublicKey;
  nonce: BigInt;
  receiverId: String;
  blockHash: Bytes;
  actions: Array<Types.Action>;
}

export interface Signature {
  keyType: Types.KeyType;
  data: Bytes;
}

export interface SignedTransaction {
  transaction: Types.Transaction;
  signature: Types.Signature;
}

export interface SignTransactionResult {
  hash: Bytes;
  signedTx: Types.SignedTransaction;
}

export interface FinalExecutionStatus {
  successValue?: String | null;
  failure?: Json | null;
}

export interface ExecutionStatus {
  successValue?: String | null;
  successReceiptId?: String | null;
  failure?: Json | null;
}

export interface ExecutionOutcomeWithId {
  id: String;
  outcome: Types.ExecutionOutcome;
}

export interface ExecutionOutcome {
  logs: Array<String>;
  receiptIds: Array<String>;
  gasBurnt: BigInt;
  status: Types.ExecutionStatus;
}

export interface FinalExecutionOutcome {
  status: Types.FinalExecutionStatus;
  transaction: Types.Transaction;
  transaction_outcome: Types.ExecutionOutcomeWithId;
  receipts_outcome: Array<Types.ExecutionOutcomeWithId>;
}

export interface QueryResponseKind {
  blockHeight: BigInt;
  blockHash: String;
}

export interface AccountView {
  amount: String;
  locked: String;
  codeHash: String;
  storageUsage: BigInt;
  storagePaidAt: BigInt;
  blockHeight: BigInt;
  blockHash: String;
}

export enum KeyTypeEnum {
  ed25519,
}

export type KeyTypeString =
  | "ed25519"

export type KeyType = KeyTypeEnum | KeyTypeString;

/// Imported Objects START ///

/// Imported Objects END ///

/// Imported Queries START ///

/// Imported Queries END ///

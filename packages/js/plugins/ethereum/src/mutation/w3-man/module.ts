// @ts-noCheck
import {
  UInt,
  UInt8,
  UInt16,
  UInt32,
  Int,
  Int8,
  Int16,
  Int32,
  Bytes,
  BigInt,
  Json,
  String,
  Boolean
} from "./types";
import * as Types from "./types";

import {
  Client,
  PluginModule,
  MaybeAsync
} from "@web3api/core-js";

export interface Input_callContractMethod extends Record<string, unknown> {
  address: String;
  method: String;
  args?: Array<String> | null;
  connection?: Types.Connection | null;
  txOverrides?: Types.TxOverrides | null;
}

export interface Input_callContractMethodAndWait extends Record<string, unknown> {
  address: String;
  method: String;
  args?: Array<String> | null;
  connection?: Types.Connection | null;
  txOverrides?: Types.TxOverrides | null;
}

export interface Input_sendTransaction extends Record<string, unknown> {
  tx: Types.TxRequest;
  connection?: Types.Connection | null;
}

export interface Input_sendTransactionAndWait extends Record<string, unknown> {
  tx: Types.TxRequest;
  connection?: Types.Connection | null;
}

export interface Input_deployContract extends Record<string, unknown> {
  abi: String;
  bytecode: String;
  args?: Array<String> | null;
  connection?: Types.Connection | null;
}

export interface Input_signMessage extends Record<string, unknown> {
  message: String;
  connection?: Types.Connection | null;
}

export interface Input_sendRPC extends Record<string, unknown> {
  method: String;
  params: Array<String>;
  connection?: Types.Connection | null;
}

export abstract class Module<
  TConfig = {}
> extends PluginModule<
  TConfig
> {
  constructor(config: TConfig) {
    super(config);
  }

  abstract callContractMethod(
    input: Input_callContractMethod,
    client: Client
  ): MaybeAsync<Types.TxResponse>;

  abstract callContractMethodAndWait(
    input: Input_callContractMethodAndWait,
    client: Client
  ): MaybeAsync<Types.TxReceipt>;

  abstract sendTransaction(
    input: Input_sendTransaction,
    client: Client
  ): MaybeAsync<Types.TxResponse>;

  abstract sendTransactionAndWait(
    input: Input_sendTransactionAndWait,
    client: Client
  ): MaybeAsync<Types.TxReceipt>;

  abstract deployContract(
    input: Input_deployContract,
    client: Client
  ): MaybeAsync<String>;

  abstract signMessage(
    input: Input_signMessage,
    client: Client
  ): MaybeAsync<String>;

  abstract sendRPC(
    input: Input_sendRPC,
    client: Client
  ): MaybeAsync<String | null>;
}

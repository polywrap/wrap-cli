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

export interface Input_callContractView extends Record<string, unknown> {
  address: String;
  method: String;
  args?: Array<String> | null;
  connection?: Types.Connection | null;
}

export interface Input_callContractStatic extends Record<string, unknown> {
  address: String;
  method: String;
  args?: Array<String> | null;
  connection?: Types.Connection | null;
  txOverrides?: Types.TxOverrides | null;
}

export interface Input_encodeParams extends Record<string, unknown> {
  types: Array<String>;
  values: Array<String>;
}

export interface Input_encodeFunction extends Record<string, unknown> {
  method: String;
  args?: Array<String> | null;
}

export interface Input_solidityPack extends Record<string, unknown> {
  types: Array<String>;
  values: Array<String>;
}

export interface Input_solidityKeccak256 extends Record<string, unknown> {
  types: Array<String>;
  values: Array<String>;
}

export interface Input_soliditySha256 extends Record<string, unknown> {
  types: Array<String>;
  values: Array<String>;
}

export interface Input_getSignerAddress extends Record<string, unknown> {
  connection?: Types.Connection | null;
}

export interface Input_getSignerBalance extends Record<string, unknown> {
  blockTag?: BigInt | null;
  connection?: Types.Connection | null;
}

export interface Input_getSignerTransactionCount extends Record<string, unknown> {
  blockTag?: BigInt | null;
  connection?: Types.Connection | null;
}

export interface Input_getGasPrice extends Record<string, unknown> {
  connection?: Types.Connection | null;
}

export interface Input_estimateTransactionGas extends Record<string, unknown> {
  tx: Types.TxRequest;
  connection?: Types.Connection | null;
}

export interface Input_estimateContractCallGas extends Record<string, unknown> {
  address: String;
  method: String;
  args?: Array<String> | null;
  connection?: Types.Connection | null;
  txOverrides?: Types.TxOverrides | null;
}

export interface Input_checkAddress extends Record<string, unknown> {
  address: String;
}

export interface Input_toWei extends Record<string, unknown> {
  eth: String;
}

export interface Input_toEth extends Record<string, unknown> {
  wei: BigInt;
}

export interface Input_awaitTransaction extends Record<string, unknown> {
  txHash: String;
  confirmations: UInt32;
  timeout: UInt32;
  connection?: Types.Connection | null;
}

export interface Input_waitForEvent extends Record<string, unknown> {
  address: String;
  event: String;
  args?: Array<String> | null;
  timeout?: UInt32 | null;
  connection?: Types.Connection | null;
}

export interface Input_getNetwork extends Record<string, unknown> {
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

  abstract callContractView(
    input: Input_callContractView,
    client: Client
  ): MaybeAsync<String>;

  abstract callContractStatic(
    input: Input_callContractStatic,
    client: Client
  ): MaybeAsync<Types.StaticTxResult>;

  abstract encodeParams(
    input: Input_encodeParams,
    client: Client
  ): MaybeAsync<String>;

  abstract encodeFunction(
    input: Input_encodeFunction,
    client: Client
  ): MaybeAsync<String>;

  abstract solidityPack(
    input: Input_solidityPack,
    client: Client
  ): MaybeAsync<String>;

  abstract solidityKeccak256(
    input: Input_solidityKeccak256,
    client: Client
  ): MaybeAsync<String>;

  abstract soliditySha256(
    input: Input_soliditySha256,
    client: Client
  ): MaybeAsync<String>;

  abstract getSignerAddress(
    input: Input_getSignerAddress,
    client: Client
  ): MaybeAsync<String>;

  abstract getSignerBalance(
    input: Input_getSignerBalance,
    client: Client
  ): MaybeAsync<BigInt>;

  abstract getSignerTransactionCount(
    input: Input_getSignerTransactionCount,
    client: Client
  ): MaybeAsync<BigInt>;

  abstract getGasPrice(
    input: Input_getGasPrice,
    client: Client
  ): MaybeAsync<BigInt>;

  abstract estimateTransactionGas(
    input: Input_estimateTransactionGas,
    client: Client
  ): MaybeAsync<BigInt>;

  abstract estimateContractCallGas(
    input: Input_estimateContractCallGas,
    client: Client
  ): MaybeAsync<BigInt>;

  abstract checkAddress(
    input: Input_checkAddress,
    client: Client
  ): MaybeAsync<Boolean>;

  abstract toWei(
    input: Input_toWei,
    client: Client
  ): MaybeAsync<BigInt>;

  abstract toEth(
    input: Input_toEth,
    client: Client
  ): MaybeAsync<String>;

  abstract awaitTransaction(
    input: Input_awaitTransaction,
    client: Client
  ): MaybeAsync<Types.TxReceipt>;

  abstract waitForEvent(
    input: Input_waitForEvent,
    client: Client
  ): MaybeAsync<Types.EventNotification>;

  abstract getNetwork(
    input: Input_getNetwork,
    client: Client
  ): MaybeAsync<Types.Network>;
}

/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.

/* eslint-disable @typescript-eslint/naming-convention */

import * as Types from "./types";

import { Client, PluginModule, MaybeAsync } from "@polywrap/core-js";

export interface Input_callContractView extends Record<string, unknown> {
  address: Types.String;
  method: Types.String;
  args?: Array<Types.String> | null;
  connection?: Types.Connection | null;
}

export interface Input_callContractStatic extends Record<string, unknown> {
  address: Types.String;
  method: Types.String;
  args?: Array<Types.String> | null;
  connection?: Types.Connection | null;
  txOverrides?: Types.TxOverrides | null;
}

export interface Input_getBalance extends Record<string, unknown> {
  address: Types.String;
  blockTag?: Types.BigInt | null;
  connection?: Types.Connection | null;
}

export interface Input_encodeParams extends Record<string, unknown> {
  types: Array<Types.String>;
  values: Array<Types.String>;
}

export interface Input_encodeFunction extends Record<string, unknown> {
  method: Types.String;
  args?: Array<Types.String> | null;
}

export interface Input_solidityPack extends Record<string, unknown> {
  types: Array<Types.String>;
  values: Array<Types.String>;
}

export interface Input_solidityKeccak256 extends Record<string, unknown> {
  types: Array<Types.String>;
  values: Array<Types.String>;
}

export interface Input_soliditySha256 extends Record<string, unknown> {
  types: Array<Types.String>;
  values: Array<Types.String>;
}

export interface Input_getSignerAddress extends Record<string, unknown> {
  connection?: Types.Connection | null;
}

export interface Input_getSignerBalance extends Record<string, unknown> {
  blockTag?: Types.BigInt | null;
  connection?: Types.Connection | null;
}

export interface Input_getSignerTransactionCount
  extends Record<string, unknown> {
  blockTag?: Types.BigInt | null;
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
  address: Types.String;
  method: Types.String;
  args?: Array<Types.String> | null;
  connection?: Types.Connection | null;
  txOverrides?: Types.TxOverrides | null;
}

export interface Input_checkAddress extends Record<string, unknown> {
  address: Types.String;
}

export interface Input_toWei extends Record<string, unknown> {
  eth: Types.String;
}

export interface Input_toEth extends Record<string, unknown> {
  wei: Types.BigInt;
}

export interface Input_awaitTransaction extends Record<string, unknown> {
  txHash: Types.String;
  confirmations: Types.UInt32;
  timeout: Types.UInt32;
  connection?: Types.Connection | null;
}

export interface Input_waitForEvent extends Record<string, unknown> {
  address: Types.String;
  event: Types.String;
  args?: Array<Types.String> | null;
  timeout?: Types.UInt32 | null;
  connection?: Types.Connection | null;
}

export interface Input_getNetwork extends Record<string, unknown> {
  connection?: Types.Connection | null;
}

export interface Input_callContractMethod extends Record<string, unknown> {
  address: Types.String;
  method: Types.String;
  args?: Array<Types.String> | null;
  connection?: Types.Connection | null;
  txOverrides?: Types.TxOverrides | null;
}

export interface Input_callContractMethodAndWait
  extends Record<string, unknown> {
  address: Types.String;
  method: Types.String;
  args?: Array<Types.String> | null;
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
  abi: Types.String;
  bytecode: Types.String;
  args?: Array<Types.String> | null;
  connection?: Types.Connection | null;
}

export interface Input_signMessage extends Record<string, unknown> {
  message: Types.String;
  connection?: Types.Connection | null;
}

export interface Input_sendRPC extends Record<string, unknown> {
  method: Types.String;
  params: Array<Types.String>;
  connection?: Types.Connection | null;
}

export abstract class Module<
  TConfig extends Record<string, unknown>
> extends PluginModule<TConfig, Types.Env> {
  abstract callContractView(
    input: Input_callContractView,
    client: Client
  ): MaybeAsync<Types.String>;

  abstract callContractStatic(
    input: Input_callContractStatic,
    client: Client
  ): MaybeAsync<Types.StaticTxResult>;

  abstract getBalance(
    input: Input_getBalance,
    client: Client
  ): MaybeAsync<Types.BigInt>;

  abstract encodeParams(
    input: Input_encodeParams,
    client: Client
  ): MaybeAsync<Types.String>;

  abstract encodeFunction(
    input: Input_encodeFunction,
    client: Client
  ): MaybeAsync<Types.String>;

  abstract solidityPack(
    input: Input_solidityPack,
    client: Client
  ): MaybeAsync<Types.String>;

  abstract solidityKeccak256(
    input: Input_solidityKeccak256,
    client: Client
  ): MaybeAsync<Types.String>;

  abstract soliditySha256(
    input: Input_soliditySha256,
    client: Client
  ): MaybeAsync<Types.String>;

  abstract getSignerAddress(
    input: Input_getSignerAddress,
    client: Client
  ): MaybeAsync<Types.String>;

  abstract getSignerBalance(
    input: Input_getSignerBalance,
    client: Client
  ): MaybeAsync<Types.BigInt>;

  abstract getSignerTransactionCount(
    input: Input_getSignerTransactionCount,
    client: Client
  ): MaybeAsync<Types.BigInt>;

  abstract getGasPrice(
    input: Input_getGasPrice,
    client: Client
  ): MaybeAsync<Types.BigInt>;

  abstract estimateTransactionGas(
    input: Input_estimateTransactionGas,
    client: Client
  ): MaybeAsync<Types.BigInt>;

  abstract estimateContractCallGas(
    input: Input_estimateContractCallGas,
    client: Client
  ): MaybeAsync<Types.BigInt>;

  abstract checkAddress(
    input: Input_checkAddress,
    client: Client
  ): MaybeAsync<Types.Boolean>;

  abstract toWei(input: Input_toWei, client: Client): MaybeAsync<Types.BigInt>;

  abstract toEth(input: Input_toEth, client: Client): MaybeAsync<Types.String>;

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
  ): MaybeAsync<Types.String>;

  abstract signMessage(
    input: Input_signMessage,
    client: Client
  ): MaybeAsync<Types.String>;

  abstract sendRPC(
    input: Input_sendRPC,
    client: Client
  ): MaybeAsync<Types.String | null>;
}

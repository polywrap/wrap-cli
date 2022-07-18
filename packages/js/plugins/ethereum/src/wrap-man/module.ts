/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.

import * as Types from "./types";

import {
  Client,
  PluginModule,
  MaybeAsync
} from "@polywrap/core-js";

export interface Args_callContractView extends Record<string, unknown> {
  address: Types.String;
  method: Types.String;
  args?: Array<Types.String> | null;
  connection?: Types.Connection | null;
}

export interface Args_callContractStatic extends Record<string, unknown> {
  address: Types.String;
  method: Types.String;
  args?: Array<Types.String> | null;
  connection?: Types.Connection | null;
  txOverrides?: Types.TxOverrides | null;
}

export interface Args_getBalance extends Record<string, unknown> {
  address: Types.String;
  blockTag?: Types.BigInt | null;
  connection?: Types.Connection | null;
}

export interface Args_encodeParams extends Record<string, unknown> {
  types: Array<Types.String>;
  values: Array<Types.String>;
}

export interface Args_encodeFunction extends Record<string, unknown> {
  method: Types.String;
  args?: Array<Types.String> | null;
}

export interface Args_solidityPack extends Record<string, unknown> {
  types: Array<Types.String>;
  values: Array<Types.String>;
}

export interface Args_solidityKeccak256 extends Record<string, unknown> {
  types: Array<Types.String>;
  values: Array<Types.String>;
}

export interface Args_soliditySha256 extends Record<string, unknown> {
  types: Array<Types.String>;
  values: Array<Types.String>;
}

export interface Args_getSignerAddress extends Record<string, unknown> {
  connection?: Types.Connection | null;
}

export interface Args_getSignerBalance extends Record<string, unknown> {
  blockTag?: Types.BigInt | null;
  connection?: Types.Connection | null;
}

export interface Args_getSignerTransactionCount extends Record<string, unknown> {
  blockTag?: Types.BigInt | null;
  connection?: Types.Connection | null;
}

export interface Args_getGasPrice extends Record<string, unknown> {
  connection?: Types.Connection | null;
}

export interface Args_estimateTransactionGas extends Record<string, unknown> {
  tx: Types.TxRequest;
  connection?: Types.Connection | null;
}

export interface Args_estimateContractCallGas extends Record<string, unknown> {
  address: Types.String;
  method: Types.String;
  args?: Array<Types.String> | null;
  connection?: Types.Connection | null;
  txOverrides?: Types.TxOverrides | null;
}

export interface Args_checkAddress extends Record<string, unknown> {
  address: Types.String;
}

export interface Args_toWei extends Record<string, unknown> {
  eth: Types.String;
}

export interface Args_toEth extends Record<string, unknown> {
  wei: Types.BigInt;
}

export interface Args_awaitTransaction extends Record<string, unknown> {
  txHash: Types.String;
  confirmations: Types.UInt32;
  timeout: Types.UInt32;
  connection?: Types.Connection | null;
}

export interface Args_waitForEvent extends Record<string, unknown> {
  address: Types.String;
  event: Types.String;
  args?: Array<Types.String> | null;
  timeout?: Types.UInt32 | null;
  connection?: Types.Connection | null;
}

export interface Args_getNetwork extends Record<string, unknown> {
  connection?: Types.Connection | null;
}

export interface Args_callContractMethod extends Record<string, unknown> {
  address: Types.String;
  method: Types.String;
  args?: Array<Types.String> | null;
  connection?: Types.Connection | null;
  txOverrides?: Types.TxOverrides | null;
}

export interface Args_callContractMethodAndWait extends Record<string, unknown> {
  address: Types.String;
  method: Types.String;
  args?: Array<Types.String> | null;
  connection?: Types.Connection | null;
  txOverrides?: Types.TxOverrides | null;
}

export interface Args_sendTransaction extends Record<string, unknown> {
  tx: Types.TxRequest;
  connection?: Types.Connection | null;
}

export interface Args_sendTransactionAndWait extends Record<string, unknown> {
  tx: Types.TxRequest;
  connection?: Types.Connection | null;
}

export interface Args_deployContract extends Record<string, unknown> {
  abi: Types.String;
  bytecode: Types.String;
  args?: Array<Types.String> | null;
  connection?: Types.Connection | null;
}

export interface Args_signMessage extends Record<string, unknown> {
  message: Types.String;
  connection?: Types.Connection | null;
}

export interface Args_sendRPC extends Record<string, unknown> {
  method: Types.String;
  params: Array<Types.String>;
  connection?: Types.Connection | null;
}

export abstract class Module<
  TConfig
> extends PluginModule<
  TConfig,
  Types.Env
> {

  abstract callContractView(
    args: Args_callContractView,
    client: Client
  ): MaybeAsync<Types.String>;

  abstract callContractStatic(
    args: Args_callContractStatic,
    client: Client
  ): MaybeAsync<Types.StaticTxResult>;

  abstract getBalance(
    args: Args_getBalance,
    client: Client
  ): MaybeAsync<Types.BigInt>;

  abstract encodeParams(
    args: Args_encodeParams,
    client: Client
  ): MaybeAsync<Types.String>;

  abstract encodeFunction(
    args: Args_encodeFunction,
    client: Client
  ): MaybeAsync<Types.String>;

  abstract solidityPack(
    args: Args_solidityPack,
    client: Client
  ): MaybeAsync<Types.String>;

  abstract solidityKeccak256(
    args: Args_solidityKeccak256,
    client: Client
  ): MaybeAsync<Types.String>;

  abstract soliditySha256(
    args: Args_soliditySha256,
    client: Client
  ): MaybeAsync<Types.String>;

  abstract getSignerAddress(
    args: Args_getSignerAddress,
    client: Client
  ): MaybeAsync<Types.String>;

  abstract getSignerBalance(
    args: Args_getSignerBalance,
    client: Client
  ): MaybeAsync<Types.BigInt>;

  abstract getSignerTransactionCount(
    args: Args_getSignerTransactionCount,
    client: Client
  ): MaybeAsync<Types.BigInt>;

  abstract getGasPrice(
    args: Args_getGasPrice,
    client: Client
  ): MaybeAsync<Types.BigInt>;

  abstract estimateTransactionGas(
    args: Args_estimateTransactionGas,
    client: Client
  ): MaybeAsync<Types.BigInt>;

  abstract estimateContractCallGas(
    args: Args_estimateContractCallGas,
    client: Client
  ): MaybeAsync<Types.BigInt>;

  abstract checkAddress(
    args: Args_checkAddress,
    client: Client
  ): MaybeAsync<Types.Boolean>;

  abstract toWei(
    args: Args_toWei,
    client: Client
  ): MaybeAsync<Types.BigInt>;

  abstract toEth(
    args: Args_toEth,
    client: Client
  ): MaybeAsync<Types.String>;

  abstract awaitTransaction(
    args: Args_awaitTransaction,
    client: Client
  ): MaybeAsync<Types.TxReceipt>;

  abstract waitForEvent(
    args: Args_waitForEvent,
    client: Client
  ): MaybeAsync<Types.EventNotification>;

  abstract getNetwork(
    args: Args_getNetwork,
    client: Client
  ): MaybeAsync<Types.Network>;

  abstract callContractMethod(
    args: Args_callContractMethod,
    client: Client
  ): MaybeAsync<Types.TxResponse>;

  abstract callContractMethodAndWait(
    args: Args_callContractMethodAndWait,
    client: Client
  ): MaybeAsync<Types.TxReceipt>;

  abstract sendTransaction(
    args: Args_sendTransaction,
    client: Client
  ): MaybeAsync<Types.TxResponse>;

  abstract sendTransactionAndWait(
    args: Args_sendTransactionAndWait,
    client: Client
  ): MaybeAsync<Types.TxReceipt>;

  abstract deployContract(
    args: Args_deployContract,
    client: Client
  ): MaybeAsync<Types.String>;

  abstract signMessage(
    args: Args_signMessage,
    client: Client
  ): MaybeAsync<Types.String>;

  abstract sendRPC(
    args: Args_sendRPC,
    client: Client
  ): MaybeAsync<Types.String | null>;
}

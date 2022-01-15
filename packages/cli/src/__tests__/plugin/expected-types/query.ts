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

import {
  Object,
  Ethereum_Connection,
  Ethereum_TxOverrides,
  Ethereum_StaticTxResult,
  Ethereum_TxRequest,
  Ethereum_TxReceipt,
  Ethereum_Log,
  Ethereum_EventNotification,
  Ethereum_Network,
  Ethereum_TxResponse,
  Ethereum_Access,
  Ethereum_Query,
  Ethereum_Mutation,
} from "./types";

import {
  Client,
  PluginModule,
  MaybeAsync
} from "@web3api/core-js";

export interface Input_method extends Record<string, unknown> {
  str: String;
  optStr?: String | null;
}

export interface Module extends PluginModule {
  method(
    input: Input_method,
    client: Client
  ): MaybeAsync<Object>;
}

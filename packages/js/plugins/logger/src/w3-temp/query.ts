/* eslint-disable */
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
  Boolean,
} from "./types";
import * as Types from "./types";

import { Client, PluginModule, MaybeAsync } from "@web3api/core-js";

export interface Input_log extends Record<string, unknown> {
  level: Types.Logger_LogLevel;
  message: string;
}

export interface Module extends PluginModule {
  log(input: Input_log, client: Client): MaybeAsync<boolean>;
}

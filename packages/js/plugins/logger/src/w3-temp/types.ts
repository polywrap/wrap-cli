/* eslint-disable */
// @ts-noCheck
import * as Types from "./";

import { Client, InvokeApiResult } from "@web3api/core-js";

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

/// Imported Objects START ///

/* URI: "ens/logger.core.web3api.eth" */
export enum Logger_LogLevelEnum {
  DEBUG,
  INFO,
  WARN,
  ERROR,
}

export type Logger_LogLevelString = "DEBUG" | "INFO" | "WARN" | "ERROR";

export type Logger_LogLevel = Logger_LogLevelEnum | Logger_LogLevelString;

/// Imported Objects END ///

/// Imported Queries START ///

/* URI: "ens/logger.core.web3api.eth" */
interface Logger_Query_Input_log extends Record<string, unknown> {
  level: Types.Logger_LogLevel;
  message: string;
}

/* URI: "ens/logger.core.web3api.eth" */
export const Logger_Query = {
  log: async (
    input: Logger_Query_Input_log,
    client: Client
  ): Promise<InvokeApiResult<boolean>> => {
    return client.invoke<boolean>({
      uri: "ens/logger.core.web3api.eth",
      module: "query",
      method: "log",
      input,
    });
  },
};

/// Imported Queries END ///

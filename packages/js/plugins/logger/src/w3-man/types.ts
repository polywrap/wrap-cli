/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.

// @ts-ignore
import * as Types from "./";

// @ts-ignore
import { Client, InvokeApiResult } from "@web3api/core-js";

export type UInt = number;
export type UInt8 = number;
export type UInt16 = number;
export type UInt32 = number;
export type Int = number;
export type Int8 = number;
export type Int16 = number;
export type Int32 = number;
export type Bytes = ArrayBuffer;
export type BigInt = string;
export type BigNumber = string;
export type Json = string;
export type String = string;
export type Boolean = boolean;

/// Envs START ///
/// Envs END ///

/// Objects START ///
/// Objects END ///

/// Enums START ///
/// Enums END ///

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

/// Imported Modules START ///

/* URI: "ens/logger.core.web3api.eth" */
interface Logger_Module_Input_log extends Record<string, unknown> {
  level: Types.Logger_LogLevel;
  message: Types.String;
}

/* URI: "ens/logger.core.web3api.eth" */
export const Logger_Module = {
  log: async (
    input: Logger_Module_Input_log,
    client: Client
  ): Promise<InvokeApiResult<Types.Boolean>> => {
    return client.invoke<Types.Boolean>({
      uri: "ens/logger.core.web3api.eth",
      method: "log",
      input,
    });
  },
};

/// Imported Modules END ///

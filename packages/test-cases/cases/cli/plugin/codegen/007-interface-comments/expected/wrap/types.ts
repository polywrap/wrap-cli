/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.

// @ts-ignore
import * as Types from "./";

// @ts-ignore
import {
  CoreClient,
  InvokeResult,
  Uri,
} from "@polywrap/core-js";

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
export type BigNumber = string;
export type Json = string;
export type String = string;
export type Boolean = boolean;

/// Env START ///
/// Env END ///

/// Objects START ///
/// Objects END ///

/// Enums START ///
/// Enums END ///

/// Imported Objects START ///

/// Imported Objects END ///

/// Imported Modules START ///

/* URI: "my/import" */
export interface Interface_Module_Args_methodA {
  arg: Types.String;
}

/* URI: "my/import" */
export interface Interface_Module_Args_methodB {
  arg: Types.Bytes;
}

/* URI: "my/import" */
export const Interface_Module = {
  methodA: async (
    args: Interface_Module_Args_methodA,
    client: CoreClient
  ): Promise<InvokeResult<Types.String>> => {
    return client.invoke<Types.String>({
      uri: Uri.from("my/import"),
      method: "methodA",
      args: (args as unknown) as Record<string, unknown>,
    });
  },

  methodB: async (
    args: Interface_Module_Args_methodB,
    client: CoreClient
  ): Promise<InvokeResult<Types.Boolean>> => {
    return client.invoke<Types.Boolean>({
      uri: Uri.from("my/import"),
      method: "methodB",
      args: (args as unknown) as Record<string, unknown>,
    });
  }
}

/// Imported Modules END ///

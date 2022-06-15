/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.

/* eslint-disable @typescript-eslint/naming-convention */

import * as Types from "./";

import { Client, InvokeApiResult } from "@polywrap/core-js";

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

/* URI: "ens/uri-resolver.core.web3api.eth" */
export interface UriResolver_MaybeUriOrManifest {
  uri?: Types.String | null;
  manifest?: Types.String | null;
}

/// Imported Objects END ///

/// Imported Modules START ///

/* URI: "ens/uri-resolver.core.web3api.eth" */
interface UriResolver_Module_Input_tryResolveUri
  extends Record<string, unknown> {
  authority: Types.String;
  path: Types.String;
}

/* URI: "ens/uri-resolver.core.web3api.eth" */
interface UriResolver_Module_Input_getFile extends Record<string, unknown> {
  path: Types.String;
}

/* URI: "ens/uri-resolver.core.web3api.eth" */
export const UriResolver_Module = {
  tryResolveUri: async (
    input: UriResolver_Module_Input_tryResolveUri,
    client: Client
  ): Promise<InvokeApiResult<Types.UriResolver_MaybeUriOrManifest | null>> => {
    return client.invoke<Types.UriResolver_MaybeUriOrManifest | null>({
      uri: "ens/uri-resolver.core.web3api.eth",
      method: "tryResolveUri",
      input,
    });
  },

  getFile: async (
    input: UriResolver_Module_Input_getFile,
    client: Client
  ): Promise<InvokeApiResult<Types.Bytes | null>> => {
    return client.invoke<Types.Bytes | null>({
      uri: "ens/uri-resolver.core.web3api.eth",
      method: "getFile",
      input,
    });
  },
};

/// Imported Modules END ///

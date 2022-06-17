/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.

/* eslint-disable @typescript-eslint/naming-convention */

import * as Types from "./";

import { Client, InvokeResult } from "@polywrap/core-js";

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
export interface Env extends Record<string, unknown> {
  disableParallelRequests?: Types.Boolean | null;
}
/// Envs END ///

/// Objects START ///
export interface ResolveResult {
  cid: Types.String;
  provider: Types.String;
}

export interface Options {
  timeout?: Types.UInt32 | null;
  provider?: Types.String | null;
  disableParallelRequests?: Types.Boolean | null;
}

/// Objects END ///

/// Enums START ///
/// Enums END ///

/// Imported Objects START ///

/* URI: "ens/uri-resolver.core.polywrap.eth" */
export interface UriResolver_MaybeUriOrManifest {
  uri?: Types.String | null;
  manifest?: Types.String | null;
}

/// Imported Objects END ///

/// Imported Modules START ///

/* URI: "ens/uri-resolver.core.polywrap.eth" */
interface UriResolver_Module_Input_tryResolveUri
  extends Record<string, unknown> {
  authority: Types.String;
  path: Types.String;
}

/* URI: "ens/uri-resolver.core.polywrap.eth" */
interface UriResolver_Module_Input_getFile extends Record<string, unknown> {
  path: Types.String;
}

/* URI: "ens/uri-resolver.core.polywrap.eth" */
export const UriResolver_Module = {
  tryResolveUri: async (
    input: UriResolver_Module_Input_tryResolveUri,
    client: Client
  ): Promise<InvokeResult<Types.UriResolver_MaybeUriOrManifest | null>> => {
    return client.invoke<Types.UriResolver_MaybeUriOrManifest | null>({
      uri: "ens/uri-resolver.core.polywrap.eth",
      method: "tryResolveUri",
      input,
    });
  },

  getFile: async (
    input: UriResolver_Module_Input_getFile,
    client: Client
  ): Promise<InvokeResult<Types.Bytes | null>> => {
    return client.invoke<Types.Bytes | null>({
      uri: "ens/uri-resolver.core.polywrap.eth",
      method: "getFile",
      input,
    });
  },
};

/// Imported Modules END ///

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */

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
export type Bytes = Uint8Array;
export type BigInt = string;
export type Json = string;
export type String = string;
export type Boolean = boolean;

/// Imported Objects START ///

/* URI: "ens/uri-resolver.core.web3api.eth" */
export interface UriResolver_MaybeUriOrManifest {
  uri?: string | null;
  manifest?: string | null;
}

/// Imported Objects END ///

/// Imported Queries START ///

/* URI: "ens/uri-resolver.core.web3api.eth" */
interface UriResolver_Query_Input_tryResolveUri
  extends Record<string, unknown> {
  authority: string;
  path: string;
}

/* URI: "ens/uri-resolver.core.web3api.eth" */
interface UriResolver_Query_Input_getFile extends Record<string, unknown> {
  path: string;
}

/* URI: "ens/uri-resolver.core.web3api.eth" */
export const UriResolver_Query = {
  tryResolveUri: async (
    input: UriResolver_Query_Input_tryResolveUri,
    client: Client
  ): Promise<InvokeApiResult<Types.UriResolver_MaybeUriOrManifest | null>> => {
    return client.invoke<Types.UriResolver_MaybeUriOrManifest | null>({
      uri: "ens/uri-resolver.core.web3api.eth",
      module: "query",
      method: "tryResolveUri",
      input,
    });
  },

  getFile: async (
    input: UriResolver_Query_Input_getFile,
    client: Client
  ): Promise<InvokeApiResult<Bytes | null>> => {
    return client.invoke<Bytes | null>({
      uri: "ens/uri-resolver.core.web3api.eth",
      module: "query",
      method: "getFile",
      input,
    });
  },
};

/// Imported Queries END ///

/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.

// @ts-ignore
import * as Types from "./";

// @ts-ignore
import {
  Client,
  InvokeResult
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
export interface Env extends Record<string, unknown> {
  disableParallelRequests?: Types.Boolean | null;
}
/// Env END ///

/// Objects START ///
/// Objects END ///

/// Enums START ///
/// Enums END ///

/// Imported Objects START ///

/* URI: "ens/ipfs.polywrap.eth" */
export interface Ipfs_Options {
  timeout?: Types.UInt32 | null;
  provider?: Types.String | null;
  disableParallelRequests?: Types.Boolean | null;
}

/* URI: "ens/ipfs.polywrap.eth" */
export interface Ipfs_ResolveResult {
  cid: Types.String;
  provider: Types.String;
}

/// Imported Objects END ///

/// Imported Modules START ///

/* URI: "ens/ipfs.polywrap.eth" */
interface Ipfs_Module_Args_cat extends Record<string, unknown> {
  cid: Types.String;
  options?: Types.Ipfs_Options | null;
}

/* URI: "ens/ipfs.polywrap.eth" */
interface Ipfs_Module_Args_resolve extends Record<string, unknown> {
  cid: Types.String;
  options?: Types.Ipfs_Options | null;
}

/* URI: "ens/ipfs.polywrap.eth" */
interface Ipfs_Module_Args_addFile extends Record<string, unknown> {
  data: Types.Bytes;
}

/* URI: "ens/ipfs.polywrap.eth" */
export const Ipfs_Module = {
  cat: async (
    args: Ipfs_Module_Args_cat,
    client: Client
  ): Promise<InvokeResult<Types.Bytes>> => {
    return client.invoke<Types.Bytes>({
      uri: "ens/ipfs.polywrap.eth",
      method: "cat",
      args
    });
  },

  resolve: async (
    args: Ipfs_Module_Args_resolve,
    client: Client
  ): Promise<InvokeResult<Types.Ipfs_ResolveResult | null>> => {
    return client.invoke<Types.Ipfs_ResolveResult | null>({
      uri: "ens/ipfs.polywrap.eth",
      method: "resolve",
      args
    });
  },

  addFile: async (
    args: Ipfs_Module_Args_addFile,
    client: Client
  ): Promise<InvokeResult<Types.String>> => {
    return client.invoke<Types.String>({
      uri: "ens/ipfs.polywrap.eth",
      method: "addFile",
      args
    });
  }
}

/// Imported Modules END ///

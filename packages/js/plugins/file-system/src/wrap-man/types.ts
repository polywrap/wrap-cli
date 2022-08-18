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
/// Env END ///

/// Objects START ///
/// Objects END ///

/// Enums START ///
/// Enums END ///

/// Imported Objects START ///

/* URI: "ens/fs.polywrap.eth" */
export enum FileSystem_EncodingEnum {
  ASCII,
  UTF8,
  UTF16LE,
  UCS2,
  BASE64,
  BASE64URL,
  LATIN1,
  BINARY,
  HEX,
}

export type FileSystem_EncodingString =
  | "ASCII"
  | "UTF8"
  | "UTF16LE"
  | "UCS2"
  | "BASE64"
  | "BASE64URL"
  | "LATIN1"
  | "BINARY"
  | "HEX"

export type FileSystem_Encoding = FileSystem_EncodingEnum | FileSystem_EncodingString;

/// Imported Objects END ///

/// Imported Modules START ///

/* URI: "ens/fs.polywrap.eth" */
interface FileSystem_Module_Args_readFile extends Record<string, unknown> {
  path: Types.String;
}

/* URI: "ens/fs.polywrap.eth" */
interface FileSystem_Module_Args_readFileAsString extends Record<string, unknown> {
  path: Types.String;
  encoding?: Types.FileSystem_Encoding | null;
}

/* URI: "ens/fs.polywrap.eth" */
interface FileSystem_Module_Args_exists extends Record<string, unknown> {
  path: Types.String;
}

/* URI: "ens/fs.polywrap.eth" */
interface FileSystem_Module_Args_writeFile extends Record<string, unknown> {
  path: Types.String;
  data: Types.Bytes;
}

/* URI: "ens/fs.polywrap.eth" */
interface FileSystem_Module_Args_mkdir extends Record<string, unknown> {
  path: Types.String;
  recursive?: Types.Boolean | null;
}

/* URI: "ens/fs.polywrap.eth" */
interface FileSystem_Module_Args_rm extends Record<string, unknown> {
  path: Types.String;
  recursive?: Types.Boolean | null;
  force?: Types.Boolean | null;
}

/* URI: "ens/fs.polywrap.eth" */
interface FileSystem_Module_Args_rmdir extends Record<string, unknown> {
  path: Types.String;
}

/* URI: "ens/fs.polywrap.eth" */
export const FileSystem_Module = {
  readFile: async (
    args: FileSystem_Module_Args_readFile,
    client: Client
  ): Promise<InvokeResult<Types.Bytes>> => {
    return client.invoke<Types.Bytes>({
      uri: "ens/fs.polywrap.eth",
      method: "readFile",
      args
    });
  },

  readFileAsString: async (
    args: FileSystem_Module_Args_readFileAsString,
    client: Client
  ): Promise<InvokeResult<Types.String>> => {
    return client.invoke<Types.String>({
      uri: "ens/fs.polywrap.eth",
      method: "readFileAsString",
      args
    });
  },

  exists: async (
    args: FileSystem_Module_Args_exists,
    client: Client
  ): Promise<InvokeResult<Types.Boolean>> => {
    return client.invoke<Types.Boolean>({
      uri: "ens/fs.polywrap.eth",
      method: "exists",
      args
    });
  },

  writeFile: async (
    args: FileSystem_Module_Args_writeFile,
    client: Client
  ): Promise<InvokeResult<Types.Boolean | null>> => {
    return client.invoke<Types.Boolean | null>({
      uri: "ens/fs.polywrap.eth",
      method: "writeFile",
      args
    });
  },

  mkdir: async (
    args: FileSystem_Module_Args_mkdir,
    client: Client
  ): Promise<InvokeResult<Types.Boolean | null>> => {
    return client.invoke<Types.Boolean | null>({
      uri: "ens/fs.polywrap.eth",
      method: "mkdir",
      args
    });
  },

  rm: async (
    args: FileSystem_Module_Args_rm,
    client: Client
  ): Promise<InvokeResult<Types.Boolean | null>> => {
    return client.invoke<Types.Boolean | null>({
      uri: "ens/fs.polywrap.eth",
      method: "rm",
      args
    });
  },

  rmdir: async (
    args: FileSystem_Module_Args_rmdir,
    client: Client
  ): Promise<InvokeResult<Types.Boolean | null>> => {
    return client.invoke<Types.Boolean | null>({
      uri: "ens/fs.polywrap.eth",
      method: "rmdir",
      args
    });
  }
}

/// Imported Modules END ///

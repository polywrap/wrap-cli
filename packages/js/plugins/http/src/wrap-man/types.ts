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

export interface Response {
  status: Types.Int;
  statusText: Types.String;
  headers?: Map<Types.String, Types.String> | null;
  body?: Types.String | null;
}

export interface Request {
  headers?: Map<Types.String, Types.String> | null;
  urlParams?: Map<Types.String, Types.String> | null;
  responseType: Types.ResponseType;
  body?: Types.String | null;
}

/// Objects END ///

/// Enums START ///
export enum ResponseTypeEnum {
  TEXT,
  BINARY,
}

export type ResponseTypeString =
  | "TEXT"
  | "BINARY"

export type ResponseType = ResponseTypeEnum | ResponseTypeString;

/// Enums END ///

/// Imported Objects START ///

/// Imported Objects END ///

/// Imported Modules START ///

/// Imported Modules END ///

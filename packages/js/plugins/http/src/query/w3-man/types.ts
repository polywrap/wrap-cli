// @ts-noCheck
import * as Types from "./";

import {
  Client,
  InvokeApiResult
} from "@web3api/core-js";

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

export interface Header {
  key: String;
  value: String;
}

export interface UrlParam {
  key: String;
  value: String;
}

export interface Response {
  status: Int;
  statusText: String;
  headers?: Array<Types.Header> | null;
  body?: String | null;
}

export interface Request {
  headers?: Array<Types.Header> | null;
  urlParams?: Array<Types.UrlParam> | null;
  responseType: Types.ResponseType;
  body?: String | null;
}

export enum ResponseTypeEnum {
  TEXT,
  BINARY,
}

export type ResponseTypeString =
  | "TEXT"
  | "BINARY"

export type ResponseType = ResponseTypeEnum | ResponseTypeString;


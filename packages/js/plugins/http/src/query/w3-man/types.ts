/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */

// @ts-ignore
import * as Types from "./";

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
  key: string;
  value: string;
}

export interface UrlParam {
  key: string;
  value: string;
}

export interface Response {
  status: Int;
  statusText: string;
  headers?: Array<Types.Header> | null;
  body?: string | null;
}

export interface Request {
  headers?: Array<Types.Header> | null;
  urlParams?: Array<Types.UrlParam> | null;
  responseType: Types.ResponseType;
  body?: string | null;
}

export enum ResponseTypeEnum {
  TEXT,
  BINARY,
}

export type ResponseTypeString = "TEXT" | "BINARY";

export type ResponseType = ResponseTypeEnum | ResponseTypeString;

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

/* URI: "ens/http.polywrap.eth" */
export interface HTTP_Request {
  headers?: Array<Types.HTTP_Header> | null;
  urlParams?: Array<Types.HTTP_UrlParam> | null;
  responseType: Types.HTTP_ResponseType;
  body?: Types.String | null;
}

/* URI: "ens/http.polywrap.eth" */
export interface HTTP_Header {
  key: Types.String;
  value: Types.String;
}

/* URI: "ens/http.polywrap.eth" */
export interface HTTP_UrlParam {
  key: Types.String;
  value: Types.String;
}

/* URI: "ens/http.polywrap.eth" */
export interface HTTP_Response {
  status: Types.Int;
  statusText: Types.String;
  headers?: Array<Types.HTTP_Header> | null;
  body?: Types.String | null;
}

/* URI: "ens/http.polywrap.eth" */
export enum HTTP_ResponseTypeEnum {
  TEXT,
  BINARY,
}

export type HTTP_ResponseTypeString =
  | "TEXT"
  | "BINARY"

export type HTTP_ResponseType = HTTP_ResponseTypeEnum | HTTP_ResponseTypeString;

/// Imported Objects END ///

/// Imported Modules START ///

/* URI: "ens/http.polywrap.eth" */
interface HTTP_Module_Args_get extends Record<string, unknown> {
  url: Types.String;
  request?: Types.HTTP_Request | null;
}

/* URI: "ens/http.polywrap.eth" */
interface HTTP_Module_Args_post extends Record<string, unknown> {
  url: Types.String;
  request?: Types.HTTP_Request | null;
}

/* URI: "ens/http.polywrap.eth" */
export const HTTP_Module = {
  get: async (
    args: HTTP_Module_Args_get,
    client: Client
  ): Promise<InvokeResult<Types.HTTP_Response | null>> => {
    return client.invoke<Types.HTTP_Response | null>({
      uri: "ens/http.polywrap.eth",
      method: "get",
      args
    });
  },

  post: async (
    args: HTTP_Module_Args_post,
    client: Client
  ): Promise<InvokeResult<Types.HTTP_Response | null>> => {
    return client.invoke<Types.HTTP_Response | null>({
      uri: "ens/http.polywrap.eth",
      method: "post",
      args
    });
  }
}

/// Imported Modules END ///

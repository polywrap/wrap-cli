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

/* URI: "ens/http.web3api.eth" */
export interface HTTP_Request {
  headers?: Array<Types.HTTP_Header> | null;
  urlParams?: Array<Types.HTTP_UrlParam> | null;
  responseType: Types.HTTP_ResponseType;
  body?: Types.String | null;
}

/* URI: "ens/http.web3api.eth" */
export interface HTTP_Header {
  key: Types.String;
  value: Types.String;
}

/* URI: "ens/http.web3api.eth" */
export interface HTTP_UrlParam {
  key: Types.String;
  value: Types.String;
}

/* URI: "ens/http.web3api.eth" */
export interface HTTP_Response {
  status: Types.Int;
  statusText: Types.String;
  headers?: Array<Types.HTTP_Header> | null;
  body?: Types.String | null;
}

/* URI: "ens/http.web3api.eth" */
export enum HTTP_ResponseTypeEnum {
  TEXT,
  BINARY,
}

export type HTTP_ResponseTypeString = "TEXT" | "BINARY";

export type HTTP_ResponseType = HTTP_ResponseTypeEnum | HTTP_ResponseTypeString;

/// Imported Objects END ///

/// Imported Modules START ///

/* URI: "ens/http.web3api.eth" */
interface HTTP_Module_Input_get extends Record<string, unknown> {
  url: Types.String;
  request?: Types.HTTP_Request | null;
}

/* URI: "ens/http.web3api.eth" */
interface HTTP_Module_Input_post extends Record<string, unknown> {
  url: Types.String;
  request?: Types.HTTP_Request | null;
}

/* URI: "ens/http.web3api.eth" */
export const HTTP_Module = {
  get: async (
    input: HTTP_Module_Input_get,
    client: Client
  ): Promise<InvokeApiResult<Types.HTTP_Response | null>> => {
    return client.invoke<Types.HTTP_Response | null>({
      uri: "ens/http.web3api.eth",
      method: "get",
      input,
    });
  },

  post: async (
    input: HTTP_Module_Input_post,
    client: Client
  ): Promise<InvokeApiResult<Types.HTTP_Response | null>> => {
    return client.invoke<Types.HTTP_Response | null>({
      uri: "ens/http.web3api.eth",
      method: "post",
      input,
    });
  },
};

/// Imported Modules END ///

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */

import * as Types from "./";

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

/* URI: "ens/http.web3api.eth" */
export interface HTTP_Request {
  headers?: Array<Types.HTTP_Header> | null;
  urlParams?: Array<Types.HTTP_UrlParam> | null;
  responseType: Types.HTTP_ResponseType;
  body?: string | null;
}

/* URI: "ens/http.web3api.eth" */
export interface HTTP_Header {
  key: string;
  value: string;
}

/* URI: "ens/http.web3api.eth" */
export interface HTTP_UrlParam {
  key: string;
  value: string;
}

/* URI: "ens/http.web3api.eth" */
export interface HTTP_Response {
  status: Int;
  statusText: string;
  headers?: Array<Types.HTTP_Header> | null;
  body?: string | null;
}

/// Imported Objects END ///

/// Imported Enums START ///

/* URI: "ens/http.web3api.eth" */
export enum HTTP_ResponseTypeEnum {
  TEXT,
  BINARY,
}

export type HTTP_ResponseTypeString = "TEXT" | "BINARY";

export type HTTP_ResponseType = HTTP_ResponseTypeEnum | HTTP_ResponseTypeString;

/// Imported Enums END ///

/// Imported Queries START ///

/* URI: "ens/http.web3api.eth" */
interface HTTP_Query_Input_get extends Record<string, unknown> {
  url: string;
  request?: Types.HTTP_Request | null;
}

/* URI: "ens/http.web3api.eth" */
interface HTTP_Query_Input_post extends Record<string, unknown> {
  url: string;
  request?: Types.HTTP_Request | null;
}

/* URI: "ens/http.web3api.eth" */
export const HTTP_Query = {
  get: async (
    input: HTTP_Query_Input_get,
    client: Client
  ): Promise<InvokeApiResult<Types.HTTP_Response | null>> => {
    return client.invoke<Types.HTTP_Response | null>({
      uri: "ens/http.web3api.eth",
      module: "query",
      method: "get",
      input,
    });
  },

  post: async (
    input: HTTP_Query_Input_post,
    client: Client
  ): Promise<InvokeApiResult<Types.HTTP_Response | null>> => {
    return client.invoke<Types.HTTP_Response | null>({
      uri: "ens/http.web3api.eth",
      module: "query",
      method: "post",
      input,
    });
  },
};

/// Imported Queries END ///

// @ts-ignore
import * as Types from "./";

// @ts-ignore
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
export type BigNumber = string;
export type Json = string;
export type String = string;
export type Boolean = boolean;

/// Imported Objects START ///

/* URI: "w3://ens/plugin.eth" */
export interface HTTP_Header {
  key: Types.String;
  value: Types.String;
}

/* URI: "w3://ens/plugin.eth" */
export interface HTTP_UrlParam {
  key: Types.String;
  value: Types.String;
}

/* URI: "w3://ens/plugin.eth" */
export interface HTTP_Response {
  status: Types.Int;
  statusText: Types.String;
  headers?: Array<Types.HTTP_Header> | null;
  body?: Types.String | null;
}

/* URI: "w3://ens/plugin.eth" */
export interface HTTP_Request {
  headers?: Array<Types.HTTP_Header> | null;
  urlParams?: Array<Types.HTTP_UrlParam> | null;
  responseType: Types.HTTP_ResponseType;
  body?: Types.String | null;
}

/// Imported Objects END ///

/// Imported Enums START ///

/* URI: "w3://ens/plugin.eth" */
export enum HTTP_ResponseTypeEnum {
  TEXT,
  BINARY,
}

export type HTTP_ResponseTypeString =
  | "TEXT"
  | "BINARY"

export type HTTP_ResponseType = HTTP_ResponseTypeEnum | HTTP_ResponseTypeString;

/// Imported Enums END ///

/// Imported Queries START ///

/* URI: "w3://ens/plugin.eth" */
interface HTTP_Query_Input_get extends Record<string, unknown> {
  url: Types.String;
  request?: Types.HTTP_Request | null;
}

/* URI: "w3://ens/plugin.eth" */
interface HTTP_Query_Input_post extends Record<string, unknown> {
  url: Types.String;
  request?: Types.HTTP_Request | null;
}

/* URI: "w3://ens/plugin.eth" */
export const HTTP_Query = {
  get: async (
    input: HTTP_Query_Input_get,
    client: Client,
    uri: string = "w3://ens/plugin.eth"
  ): Promise<InvokeApiResult<Types.HTTP_Response | null>> => {
    return client.invoke<Types.HTTP_Response | null>({
      uri,
      module: "query",
      method: "get",
      input
    });
  },

  post: async (
    input: HTTP_Query_Input_post,
    client: Client,
    uri: string = "w3://ens/plugin.eth"
  ): Promise<InvokeApiResult<Types.HTTP_Response | null>> => {
    return client.invoke<Types.HTTP_Response | null>({
      uri,
      module: "query",
      method: "post",
      input
    });
  }
}

/// Imported Queries END ///

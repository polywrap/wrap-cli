// @ts-noCheck
import {
  UInt,
  UInt8,
  UInt16,
  UInt32,
  Int,
  Int8,
  Int16,
  Int32,
  Bytes,
  BigInt,
  Json,
  String,
  Boolean
} from "./types";
import * as Types from ".";
import { Client, Uri, InvokeApiOptions, InvokeApiResult } from "@web3api/core-js";

export interface TestImportQueryModule {
  importedMethod(input: Types.TestImport_Query_Input_importedMethod): Promise<Types.TestImport_Object | null>;
}

export class TestImportQueryExtension implements TestImportQueryModule {

  private _client: Client;
  private _uri: Uri;

  constructor(client: Client, uri: Uri = new Uri("testimport.uri.eth")) {
    this._client = client;
    this._uri = uri;
  }

  async importedMethod(
    input: Types.TestImport_Query_Input_importedMethod
  ): Promise<Types.TestImport_Object | null> {
    return this.throwIfError(
      Types.TestImport_Query.importedMethod(
        input,
        this._client,
        this._uri.uri
      )
    );
  }

  private throwIfError<T>(result: InvokeApiResult<T>): T {
    if (result.error) {
      throw result.error;
    }
    if (result.data === undefined) {
      throw Error(`Polywrap client returned 'undefined', but no errors were detected`);
    }
    return result.data;
  }
}

import { Web3APIClient } from "./client";
import { WasmWorker, WasmCallback } from "./lib/wasm-worker";

import * as MsgPack from "@msgpack/msgpack";
import gql from "graphql-tag";

export interface Web3APIImports {
  w3: {
    __query_api: (
      uri_ptr: number, uri_len: number,
      query_ptr: number, query_len: number,
      cb: WasmCallback
    ) => Promise<void>
  }
}

export function getImports(
  getWasmWorker: () => WasmWorker,
  client: Web3APIClient
): Web3APIImports {
  return {
    w3: {
      __query_api: async (
        uri_ptr: number, uri_len: number,
        query_ptr: number, query_len: number,
        cb: WasmCallback
      ) => {
        const ww = getWasmWorker();
        const uri = (await ww.readString(uri_ptr, uri_len));
        const query = (await ww.readString(query_ptr, query_len));
        const { data } = await client.query(uri, { query: gql(query) });

        if (!data) {
          throw Error("Error: Query returned no data.");
        }

        const result = MsgPack.encode(data);
        const result_ptr = (await ww.writeBytes(result));

        // TODO: is this even needed anymore?
        cb(result_ptr);
      }
    }
  }
}

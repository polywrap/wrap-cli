import { WasmThread } from "./thread";
import * as MsgPack from "@msgpack/msgpack";

export interface Web3APIImports {
  w3: {
    __w3_query_api: (
      uri_ptr: number, uri_len: number,
      query_ptr: number, query_len: number
    ) => Promise<Uint8Array>
  }
}

export function getImports(
  getWasmThread: () => WasmThread
): Web3APIImports {
  return {
    w3: {
      __w3_query_api: async (
        uri_ptr: number, uri_len: number,
        query_ptr: number, query_len: number
      ): Promise<Uint8Array> => {
        const wasm = getWasmThread();
        const uri = wasm.readString(uri_ptr, uri_len);
        const query = wasm.readString(query_ptr, query_len);
        const { data } = await wasm.clientQuery({
          uri,
          query
        });

        if (!data) {
          throw Error("Error: Query returned no data.");
        }

        return MsgPack.encode(data);
      }
    }
  }
}

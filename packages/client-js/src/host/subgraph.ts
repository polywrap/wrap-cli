import { Subgraph } from "../portals";
import { WasmWorker, WasmCallback } from "../lib/wasm-worker";

import gql from "graphql-tag";

export interface ISubgraphImports {
  _w3_subgraph_query(queryPtr: number, cb: WasmCallback): Promise<void>;
}

export function getSubgraphImports(
  getWasmWorker: () => WasmWorker,
  subgraph: Subgraph
): ISubgraphImports {
  return {
    _w3_subgraph_query: async (queryPtr: number, cb: WasmCallback) => {
      const ww = getWasmWorker();
      const query = (await ww.readStringAsync(queryPtr)).result;
      await subgraph.query({
        query: gql(query)
      })
    }
  }
}

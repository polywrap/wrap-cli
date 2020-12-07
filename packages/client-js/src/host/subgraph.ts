import {Subgraph} from '../portals';
import {WasmWorker, WasmCallback} from '../lib/wasm-worker';

import gql from 'graphql-tag';

export interface ISubgraphImports {
  _w3_subgraph_query(queryPtr: number, cb: WasmCallback): Promise<void>;
}

export function getSubgraphImports(getWasmWorker: () => WasmWorker, subgraph: Subgraph): ISubgraphImports {
  return {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _w3_subgraph_query: async (queryPtr: number, cb: WasmCallback) => {
      const ww = getWasmWorker();
      const query = (await ww.readStringAsync(queryPtr)).result;
      // TODO: test and make this work
      await subgraph.query('TODO', {
        query: gql(query),
      });
    },
  };
}

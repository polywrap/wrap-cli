import { Web3API } from "./Web3API";
import { DocumentNode } from "graphql/language";

export interface IQueryOptions {
  api: Web3API;
  query: DocumentNode;
  variables?: { [name: string]: any }
}

export function query(options: IQueryOptions) {
  // TODO:
  // - Parse query & build plan
  // - Fetch Web3API package from URI
  // - - only get relevant parts (future optimization)
  // - Execute query plan
  // - - load WASM module if necessary
}

// TODO:
// - Ganache + ENS in test env

import { DocumentNode } from "graphql/language";
import { ExecutionResult } from "graphql/execution";
//import { ResultObject, ASUtil } from "@assemblyscript/loader";

export interface Query {
  query: DocumentNode
  variables?: Record<string, any>
}

export type QueryResult = ExecutionResult

// TODO: remove me when this is automatically generated in the
//       @web3api/manifest package based on the JSON-Schema
//       Check: https://github.com/Web3-API/prototype/issues/60
export interface ModulePath {
  language: string;
  file: string;
}

export interface ASMarshalUtil {
  UINT8ARRAY_ID: number
}

// TODO: hack
export type ASCModule = any//ResultObject & { exports: ASUtil & ASMarshalUtil };

// TODO: hack
export type ASCImports = any//Imports;

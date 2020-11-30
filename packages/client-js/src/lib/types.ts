import { DocumentNode } from "graphql/language";
import { ExecutionResult } from "graphql/execution";
//import { ResultObject, ASUtil } from "@assemblyscript/loader";

export interface Query {
  query: DocumentNode
  variables?: Record<string, any>
}

export type QueryResult = ExecutionResult

export interface ASMarshalUtil {
  UINT8ARRAY_ID: number
}

// TODO: hack
export type ASCModule = any//ResultObject & { exports: ASUtil & ASMarshalUtil };

// TODO: hack
export type ASCImports = any//Imports;

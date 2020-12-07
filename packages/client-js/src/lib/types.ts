import {DocumentNode} from 'graphql/language';
import {ExecutionResult} from 'graphql/execution';
//import { ResultObject, ASUtil } from "@assemblyscript/loader";

export interface Query {
  query: DocumentNode;
  variables?: Record<string, unknown>;
}

export type QueryResult = ExecutionResult;

export interface ASMarshalUtil {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  UINT8ARRAY_ID: number;
}

// TODO: hack
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ASCModule = any; //ResultObject & { exports: ASUtil & ASMarshalUtil };

// TODO: hack
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ASCImports = any; //Imports;

import { Uri } from "../";
import { ExecuteResult } from "../web3api";

import { DocumentNode } from "graphql";
import gql from "graphql-tag";

export * from "./query-parser";

export type QueryDocument = DocumentNode;

export interface QueryArgs<
  TVariables extends Record<string, unknown> = Record<string, unknown>
> {
  uri: Uri;
  query: string | QueryDocument;
  variables?: TVariables
}

export type QueryResult<
  TData = Record<string, unknown>
> = ExecuteResult<TData>

export type QueryMethod<TData = Record<string, unknown>> = (
  args: QueryArgs
) => Promise<QueryResult<TData>>;

export interface QueryClient {
  query: QueryMethod;
}

export function createQueryDocument(query: string): QueryDocument {
  return gql(query);
}

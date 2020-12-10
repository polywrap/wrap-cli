import {
  Uri,
  InvokeApiResult
} from ".";

import { DocumentNode } from "graphql";
import gql from "graphql-tag";

export type QueryDocument = DocumentNode;

export function createQueryDocument(query: string): QueryDocument {
  return gql(query);
}

export interface QueryArgs<
  TVariables extends Record<string, unknown> = Record<string, unknown>
> {
  uri: Uri;
  query: string | QueryDocument;
  variables?: TVariables
}

export type QueryResult<
  TData = Record<string, unknown>
> = InvokeApiResult<TData>

export interface QueryClient {
  query: <
    TData extends Record<string, unknown> = Record<string, unknown>,
    TVariables extends Record<string, unknown> = Record<string, unknown>
  >(
    args: QueryArgs<TVariables>
  ) => Promise<QueryResult<TData>>;
}

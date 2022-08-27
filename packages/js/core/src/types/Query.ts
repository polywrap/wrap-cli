import { Uri, InvokeOptions } from "./";

import { Tracer } from "@polywrap/tracing-js";
import { DocumentNode } from "graphql";
import gql from "graphql-tag";

/** GraphQL QueryDocument */
export type QueryDocument = DocumentNode;

/** Create a GraphQL QueryDocument by parsing a string */
export const createQueryDocument = Tracer.traceFunc(
  "core: createQueryDocument",
  (query: string): QueryDocument => {
    return gql(query);
  }
);

/** Options required for an Wrapper query. */
export interface QueryOptions<
  TVariables extends Record<string, unknown> = Record<string, unknown>,
  TUri extends Uri | string = string
> {
  /** The Wrapper's URI */
  uri: TUri;

  /**
   * The GraphQL query to parse and execute, leading to one or more
   * Wrapper invocations.
   */
  query: string | QueryDocument;

  /**
   * Variables referenced within the query string via GraphQL's '$variable' syntax.
   */
  variables?: TVariables;
}

/**
 * The result of an Wrapper query, which is the aggregate
 * of one or more [[InvokeResult | invocation results]].
 *
 * @template TData Type of the query result data.
 */
export interface QueryResult<
  TData extends Record<string, unknown> = Record<string, unknown>
> {
  /**
   * Query result data. The type of this value is a named map,
   * where the key is the method's name, and value is the [[InvokeResult]]'s data.
   * This is done to allow for parallel invocations within a
   * single query document. In case of method name collisions,
   * a postfix of `_0` will be applied, where 0 will be incremented for
   * each occurrence. If undefined, it means something went wrong.
   * Errors should be populated with information as to what happened.
   * Null is used to represent an intentionally null result.
   */
  data?: TData;

  /** Errors encountered during the query. */
  errors?: Error[];
}

export interface QueryInvocations<TUri extends Uri | string = string> {
  [methodOrAlias: string]: InvokeOptions<TUri>;
}

/** A type that can parse & execute a given query */
export interface QueryHandler {
  query<
    TData extends Record<string, unknown> = Record<string, unknown>,
    TVariables extends Record<string, unknown> = Record<string, unknown>,
    TUri extends Uri | string = string
  >(
    options: QueryOptions<TVariables, TUri>
  ): Promise<QueryResult<TData>>;
}

import { Uri, UriRedirect } from "./";

import { DocumentNode, parse } from "graphql";
import gql from "graphql-tag";

/** GraphQL SchemaDocument */
export type SchemaDocument = DocumentNode;

/** Create a GraphQL SchemaDocument by parsing a string */
export function createSchemaDocument(schema: string): SchemaDocument {
  return parse(schema);
}

/** GraphQL QueryDocument */
export type QueryDocument = DocumentNode;

/** Create a GraphQL QueryDocument by parsing a string */
export function createQueryDocument(query: string): QueryDocument {
  return gql(query);
}

/** Options required for an API query. */
export interface QueryApiOptions<
  TVariables extends Record<string, unknown> = Record<string, unknown>,
  TUri = Uri
> {
  /** The API's URI */
  uri: TUri;

  /**
   * The GraphQL query to parse and execute, leading to one or more
   * API invocations.
   */
  query: string | QueryDocument;

  /**
   * Variables referenced within the query string via GraphQL's '$variable' syntax.
   */
  variables?: TVariables;

  /**
   * Redirects valid only in this query call.
   */
  redirects?: UriRedirect<string>[];
}

/**
 * The result of an API query, which is the aggregate
 * of one or more [[InvokeApiResult | invocation results]].
 *
 * @template TData Type of the query result data.
 */
export interface QueryApiResult<
  TData extends Record<string, unknown> = Record<string, unknown>
> {
  /**
   * Query result data. The type of this value is a named map,
   * where the key is the method's name, and value is the [[InvokeApiResult]]'s data.
   * This is done to allow for parallel invocations within a
   * single query document. In case of method name collisions,
   * a postfix of `_0` will be applied, where 0 will be incremented for
   * each occurrence. If undefined, it means something went wrong.
   * Errors should be populated with information as to what happened.
   * Null is used to represent an intentionally null result.
   */
  // TODO: is it correct to have this optionally undefined? Should it instead be { } for "undefined" cases?
  //       axios follows this pattern, does GraphQL/Apollo?
  data?: TData;

  /** Errors encountered during the query. */
  errors?: Error[];
}

/** A type that can parse & execute a given query */
export interface QueryHandler {
  query<
    TData extends Record<string, unknown> = Record<string, unknown>,
    TVariables extends Record<string, unknown> = Record<string, unknown>
  >(
    options: QueryApiOptions<TVariables, string>
  ): Promise<QueryApiResult<TData>>;
}

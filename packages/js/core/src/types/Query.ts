import { Uri, InvokeOptions, ClientConfig } from "./";

import { Tracer } from "@polywrap/tracing-js";
import { DocumentNode } from "graphql";
import gql from "graphql-tag";
import { Result } from "@polywrap/result";

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
  TUri extends Uri | string = string,
  TClientConfig extends ClientConfig = ClientConfig
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

  /**
   * Override the client's config for all invokes within this query.
   */
  config?: Partial<TClientConfig>;

  /**
   * Query id used to track query context data set internally.
   */
  contextId?: string;
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
  ): Promise<Result<TData, Error[]>>;
}

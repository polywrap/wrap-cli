import { Uri } from "./Uri";
import { QueryApiOptions, QueryApiResult, QueryDocument } from "./Query";

/** Defines the frequency of API invocations for an API subscription */
export interface SubscriptionFrequency {
  sec?: number;
  min?: number;
  hours?: number;
}

/** Options required for an API subscription. */
export interface SubscribeOptions<
  TVariables extends Record<string, unknown> = Record<string, unknown>,
  TUri = Uri
> extends QueryApiOptions<TVariables, TUri> {
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
   * The frequency of API invocations.
   */
  frequency: SubscriptionFrequency;
}

/**
 * The result of an API subscription, which periodically calls
 * a query and provides the QueryApiResult
 *
 * @template TData Type of the query result data.
 */
export interface Subscription<
  TData extends Record<string, unknown> = Record<string, unknown>
> extends QueryApiResult<TData> {
  /**
   * Result data from latest query. The type of this value is a named map,
   * where the key is the method's name, and value is the [[InvokeApiResult]]'s data.
   * This is done to allow for parallel invocations within a
   * single query document. In case of method name collisions,
   * a postfix of `_0` will be applied, where 0 will be incremented for
   * each occurrence. If undefined, it means either the first
   * call has not yet been completed or something went wrong.
   * If something went wrong, errors should be populated with information as to
   * what happened. Null is used to represent an intentionally null result.
   */
  data?: TData;

  /** Errors encountered during latest query. */
  errors?: Error[];

  /** Cancels subscription. */
  stop(): void;

  /** Sets a function that will be called after each completed query.
   * The function is also called immediately if the first query has been
   * completed and data is available */
  pipe(fn: (result?: TData) => void | Promise<void>): this;
}

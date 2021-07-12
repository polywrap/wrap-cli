import { Uri } from "./Uri";
import { QueryApiOptions, QueryApiResult } from "./Query";

/** Defines the frequency of API invocations for an API subscription */
export interface SubscriptionFrequency {
  ms?: number;
  sec?: number;
  min?: number;
  hours?: number;
}

/** Options required for an API subscription. */
export interface SubscribeOptions<
  TVariables extends Record<string, unknown> = Record<string, unknown>,
  TUri = Uri
> extends QueryApiOptions<TVariables, TUri> {
  /**
   * The frequency of API invocations. Defaults to one query per minute.
   */
  frequency?: SubscriptionFrequency;
}

/**
 * The result of an API subscription, which periodically calls
 * a query and provides the QueryApiResult. Implements AsyncIterableIterator.
 *
 * @template TData Type of the query result.
 */
export interface Subscription<
  TData extends Record<string, unknown> = Record<string, unknown>
> {
  frequency: number;
  isActive: boolean;
  stop(): void;
  [Symbol.asyncIterator](): AsyncGenerator<QueryApiResult<TData>>;
}

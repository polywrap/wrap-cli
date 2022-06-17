import { Uri } from "./Uri";
import { ClientConfig } from "./Client";
import { QueryOptions, QueryResult } from "./Query";

/** Defines the frequency of Wrapper invocations for an Wrapper subscription */
export interface SubscriptionFrequency {
  ms?: number;
  sec?: number;
  min?: number;
  hours?: number;
}

/** Options required for an Wrapper subscription. */
export interface SubscribeOptions<
  TVariables extends Record<string, unknown> = Record<string, unknown>,
  TUri extends Uri | string = string,
  TClientConfig extends ClientConfig = ClientConfig
> extends QueryOptions<TVariables, TUri, TClientConfig> {
  /**
   * The frequency of Wrapper invocations. Defaults to one query per minute.
   */
  frequency?: SubscriptionFrequency;
}

/**
 * An Wrapper subscription, which implements the AsyncIterator protocol, is an
 * AsyncIterable that yields query results at a specified frequency.
 * @template TData Type of the query result.
 */
export interface Subscription<
  TData extends Record<string, unknown> = Record<string, unknown>
> {
  /**
   * The frequency of Wrapper invocations.
   */
  frequency: number;
  /**
   * Indicates whether the subscription is currently active.
   */
  isActive: boolean;
  /**
   * Stops subscription. If a query has been called but has not yet returned,
   * that query will be completed and its result will be yielded.
   */
  stop(): void;
  /**
   * Implementation of AsyncIterator protocol makes the Subscription an
   * AsyncIterable, allowing use in for await...of loops.
   */
  [Symbol.asyncIterator](): AsyncGenerator<QueryResult<TData>>;
}

export interface SubscriptionHandler {
  subscribe<
    TData extends Record<string, unknown> = Record<string, unknown>,
    TVariables extends Record<string, unknown> = Record<string, unknown>,
    TUri extends Uri | string = string
  >(
    options: SubscribeOptions<TVariables, TUri>
  ): Subscription<TData>;
}

import { Uri } from "./Uri";
import { ClientConfig } from "./Client";
import { InvokeOptions } from "./Invoke";

import { Result } from "@polywrap/result";

/** Defines the frequency of Wrapper invocations for an Wrapper subscription */
export interface SubscriptionFrequency {
  ms?: number;
  sec?: number;
  min?: number;
  hours?: number;
}

/** Options required for an Wrapper subscription. */
export interface SubscribeOptions<
  TUri extends Uri | string = string,
  TClientConfig extends ClientConfig = ClientConfig
> extends InvokeOptions<TUri, TClientConfig> {
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
export interface Subscription<TData = unknown> {
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
  [Symbol.asyncIterator](): AsyncGenerator<Result<TData, Error>>;
}

export interface SubscriptionHandler {
  subscribe<TData = unknown, TUri extends Uri | string = string>(
    options: SubscribeOptions<TUri>
  ): Subscription<TData>;
}

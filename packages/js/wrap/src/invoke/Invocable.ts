import {
  InvokeResult,
  InvokeOptions,
  Invoker
} from ".";

/**
 * Result of a Wrapper invocation, possibly Msgpack-encoded.
 *
 * @template TData Type of the invoke result data.
 */
export type InvocableResult<TData = unknown> = InvokeResult<TData> & {
  /** If true, result (if successful) contains a Msgpack-encoded byte array */
  encoded?: boolean;
};

/** An invocable entity, such as a wrapper. */
export interface Invocable {
  /**
   * Invoke this object.
   *
   * @param options - invoke options
   * @param invoker - an Invoker, capable of invoking this object
   * @returns A Promise with a Result containing the return value or an error
   */
  invoke(
    options: InvokeOptions,
    invoker: Invoker
  ): Promise<InvocableResult<unknown>>;
}

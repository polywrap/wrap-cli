import { InvokeOptions, InvokeResult } from ".";
import { Wrapper } from "../wrapper";

/**
 * Provides options for the invoker to set based on the state of the invocation.
 * Extends InvokeOptions.
 */
export interface InvokerOptions extends InvokeOptions {
  /** If true, the InvokeResult will (if successful) contain a Msgpack-encoded byte array */
  encodeResult?: boolean;
}

/**
 * An entity capable of invoking wrappers.
 *
 * @template TData Type of the invoke result data.
 */
export interface Invoker {
  /**
   * Invoke a wrapper using an instance of the wrapper.
   *
   * @param options - invoker options and a wrapper instance to invoke
   * @returns A Promise with a Result containing the return value or an error
   */
  invokeWrapper<TData = unknown>(
    options: InvokerOptions & { wrapper: Wrapper }
  ): Promise<InvokeResult<TData>>;

  /**
   * Invoke a wrapper.
   *
   * @remarks
   * Unlike `invokeWrapper`, this method automatically retrieves and caches the wrapper.
   *
   * @param options - invoker options
   * @returns A Promise with a Result containing the return value or an error
   */
  invoke<TData = unknown>(
    options: InvokerOptions
  ): Promise<InvokeResult<TData>>;
}
import { WrapError, Uri, Wrapper } from ".";
import { IUriResolutionContext } from "../uri-resolution";

import { Result } from "@polywrap/result";

// $start: Invoke.ts

/** Options required for an Wrapper invocation. */
export interface InvokeOptions {
  /** The Wrapper's URI */
  uri: Uri;

  /** Method to be executed. */
  method: string;

  /** Arguments for the method, structured as a map, removing the chance of incorrectly ordered arguments. */
  args?: Record<string, unknown> | Uint8Array;

  /** Env variables for the wrapper invocation. */
  env?: Record<string, unknown>;

  /** A Uri resolution context */
  resolutionContext?: IUriResolutionContext;
}

/**
 * Result of an Wrapper invocation.
 *
 * @template TData Type of the invoke result data.
 */
export type InvokeResult<TData = unknown> = Result<TData, WrapError>;

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

// $end

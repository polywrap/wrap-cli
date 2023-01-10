import { WrapError, Uri, Wrapper } from ".";
import { IUriResolutionContext } from "../uri-resolution";

import { Result } from "@polywrap/result";

/** Options required for an Wrapper invocation. */
export interface InvokeOptions {
  /** The Wrapper's URI */
  uri: Uri;

  /** Method to be executed. */
  method: string;

  /**
   * Arguments for the method, structured as a map,
   * removing the chance of incorrectly ordering arguments.
   */
  args?: Record<string, unknown> | Uint8Array;

  /**
   * Env variables for the wrapper invocation.
   */
  env?: Record<string, unknown>;

  resolutionContext?: IUriResolutionContext;
}

/**
 * Result of an Wrapper invocation.
 *
 * @template TData Type of the invoke result data.
 */
export type InvokeResult<TData = unknown> = Result<TData, WrapError>;

export interface InvokerOptions extends InvokeOptions {
  encodeResult?: boolean;
}

export interface Invoker {
  invokeWrapper<TData = unknown>(
    options: InvokerOptions & { wrapper: Wrapper }
  ): Promise<InvokeResult<TData>>;
  invoke<TData = unknown>(
    options: InvokerOptions
  ): Promise<InvokeResult<TData>>;
}

export type InvocableResult<TData = unknown> = InvokeResult<TData> & {
  encoded?: boolean;
};

export interface Invocable {
  invoke(
    options: InvokeOptions,
    invoker: Invoker
  ): Promise<InvocableResult<unknown>>;
}

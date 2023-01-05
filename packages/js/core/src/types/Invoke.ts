import { WrapError, Uri, Wrapper } from ".";
import { IUriResolutionContext } from "../uri-resolution";

import { Result } from "@polywrap/result";

/** Options required for an Wrapper invocation. */
export interface InvokeOptions<TUri extends Uri | string = string> {
  /** The Wrapper's URI */
  uri: TUri;

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

export interface InvokerOptions<TUri extends Uri | string = string>
  extends InvokeOptions<TUri> {
  encodeResult?: boolean;
}

export interface Invoker {
  invokeWrapper<TData = unknown, TUri extends Uri | string = string>(
    options: InvokerOptions<TUri> & { wrapper: Wrapper }
  ): Promise<InvokeResult<TData>>;
  invoke<TData = unknown, TUri extends Uri | string = string>(
    options: InvokerOptions<TUri>
  ): Promise<InvokeResult<TData>>;
}

export type InvocableResult<TData = unknown> = InvokeResult<TData> & {
  encoded?: boolean;
};

export interface Invocable {
  invoke(
    options: InvokeOptions<Uri>,
    invoker: Invoker
  ): Promise<InvocableResult<unknown>>;
}

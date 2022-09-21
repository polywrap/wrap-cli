import { ClientConfig, Uri, Wrapper } from ".";
import { IUriResolutionContext } from "../uri-resolution";

import { Result } from "@polywrap/result";

/** Options required for an Wrapper invocation. */
export interface InvokeOptions<
  TUri extends Uri | string = string,
  TClientConfig extends ClientConfig = ClientConfig
> {
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
   * Override the client's config for all invokes within this invoke.
   */
  config?: Partial<TClientConfig>;

  /**
   * Env variables for the wrapper invocation.
   */
  env?: Record<string, unknown>;

  resolutionContext?: IUriResolutionContext;

  /**
   * Invoke id used to track query context data set internally.
   */
  contextId?: string;
}

export interface InvokerOptions<
  TUri extends Uri | string = string,
  TClientConfig extends ClientConfig = ClientConfig
> extends InvokeOptions<TUri, TClientConfig> {
  encodeResult?: boolean;
}

export interface Invoker {
  invokeWrapper<TData = unknown, TUri extends Uri | string = string>(
    options: InvokerOptions<TUri> & { wrapper: Wrapper }
  ): Promise<Result<TData, Error>>;
  invoke<TData = unknown, TUri extends Uri | string = string>(
    options: InvokerOptions<TUri>
  ): Promise<Result<TData, Error>>;
}

export interface InvocableResult<TData = unknown> {
  data: Result<TData, Error>;
  encoded?: boolean;
}

export interface Invocable {
  invoke(
    options: InvokeOptions<Uri>,
    invoker: Invoker
  ): Promise<InvocableResult<unknown>>;
}

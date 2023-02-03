import { IUriResolutionContext, Uri } from "@polywrap/core-js";

export interface InvokerOptions<TUri extends Uri | string = string> {
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
  encodeResult?: boolean;
}

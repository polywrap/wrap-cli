import { Uri, UriResolutionContext } from "../uri-resolution";

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
  resolutionContext?: UriResolutionContext;
}

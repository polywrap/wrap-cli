import { ClientConfig, Uri } from "..";

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
  args?: Record<string, unknown> | ArrayBuffer;

  // TODO:
  // - InvokerOptions.encodeResult?: boolean
  // - InvokableResult.encodedResult: boolean
  //
  // - wasm -> { encodedResult: true }
  // - plugin -> { encodedResult: false }
  // - wasm <-> Invoker { encodeResult: true }
  // - plugin <-> Invoker { encodeResult: false }
  /**
   * If set to true, the invoke function will not decode the msgpack results
   * into JavaScript objects, and instead return the raw ArrayBuffer.
   */
  encodeResult?: boolean;

  /**
   * Override the client's config for all invokes within this invoke.
   */
  config?: Partial<TClientConfig>;

  /**
   * Invoke id used to track query context data set internally.
   */
  contextId?: string;
}

/**
 * Result of an Wrapper invocation.
 *
 * @template TData Type of the invoke result data.
 */
export interface InvokeResult<TData = unknown> {
  /**
   * Invoke result data. The type of this value is the return type
   * of the method. If undefined, it means something went wrong.
   * Errors should be populated with information as to what happened.
   * Null is used to represent an intentionally null result.
   */
  data?: TData;

  /** Errors encountered during the invocation. */
  error?: Error;
}

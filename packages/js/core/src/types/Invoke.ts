import { ClientConfig, Uri } from ".";

export type InvokableModules = "query" | "mutation";

/** Options required for an API invocation. */
export interface InvokeApiOptions<
  TUri extends Uri | string = string,
  TClientConfig extends ClientConfig = ClientConfig
> {
  /** The API's URI */
  uri: TUri;

  /** Module to be called into. */
  module: InvokableModules;

  /** Method to be executed. */
  method: string;

  /**
   * Input arguments for the method, structured as a map,
   * removing the chance of incorrectly ordering arguments.
   */
  input?: Record<string, unknown> | ArrayBuffer;

  /**
   * Filters the [[InvokeApiResult]] data properties. The key
   * of this map is the property's name, while the value is
   * either true (meaning select this prop), or a nested named map,
   * allowing for the filtering of nested objects.
   */
  resultFilter?: Record<string, unknown>;

  /**
   * If set to true, the invoke function will not decode the msgpack results
   * into JavaScript objects, and instead return the raw ArrayBuffer.
   */
  noDecode?: boolean;

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
 * Result of an API invocation.
 *
 * @template TData Type of the invoke result data.
 */
export interface InvokeApiResult<TData = unknown> {
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

export interface InvokeHandler {
  invoke<TData = unknown, TUri extends Uri | string = string>(
    options: InvokeApiOptions<TUri>
  ): Promise<InvokeApiResult<TData>>;
}

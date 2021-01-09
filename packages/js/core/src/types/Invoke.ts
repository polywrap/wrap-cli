import { Uri } from ".";

export type InvokableModules = "query" | "mutation";

/** Options required for an API invocation. */
export interface InvokeApiOptions {

  /** The API's URI */
  uri: Uri;

  /** Module to be called into. */
  module: InvokableModules;

  /** Method to be executed. */
  method: string;

  /**
   * Input arguments for the method, structured as a map,
   * removing the chance of incorrectly ordering arguments.
   */
  input: Record<string, unknown>;

  /**
   * Filters the [[InvokeApiResult]] data properties. The key
   * of this map is the property's name, while the value is
   * either true (meaning select this prop), or a nested named map,
   * allowing for the filtering of nested objects.
   */
  resultFilter?: Record<string, unknown>;
}

/**
 * Result of an API invocation.
 * 
 * @template TData Type of the invoke result data.
 */
export interface InvokeApiResult<
  TData = unknown
> {
  /**
   * Invoke result data. The type of this value is the return type
   * of the method. If undefined, it means something went wrong.
   * Errors should be populated with information as to what happened.
   * Null is used to represent an intentionally null result.
   */
  data?: TData;

  /** Errors encountered during the invocation. */
  errors?: Error[];
}

export interface InvokeHandler {
  invoke<
    TData = unknown
  >(
    options: InvokeApiOptions
  ): Promise<InvokeApiResult<TData>>
}

import { Client, InvokeApiOptions, InvokeApiResult, PluginManifest } from ".";
import { GetManifestOptions, Manifest } from "../manifest";

/**
 * The API definition, which can be used to spawn
 * many invocations of this particular API. Internally
 * this class may do things like caching WASM bytecode, spawning
 * worker threads, or indexing into resolvers to find the requested method.
 */
export abstract class Api {
  /**
   * Invoke the API based on the provided [[InvokeApiOptions]]
   *
   * @param options Options for this invocation.
   * @param client The client instance requesting this invocation.
   * This client will be used for any sub-queries that occur.
   */
  public abstract async invoke(
    options: InvokeApiOptions,
    client: Client
  ): Promise<InvokeApiResult<unknown>>;

  /** Get the API's schema */
  public abstract async getSchema(client: Client): Promise<string>;

  /**
   * Get the API's manifest
   *
   * @param options Options for manifest retrieval
   * @param client The client instance requesting this invocation.
   * This client will be used for any sub-queries that occur.
   */
  public abstract async getManifest(
    options: GetManifestOptions,
    client: Client
  ): Promise<Manifest | PluginManifest>;
}

/** Cache of API definitions, mapping the API's URI to its definition */
export type ApiCache = Map<string, Api>;

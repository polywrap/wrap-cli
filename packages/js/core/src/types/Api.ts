import { Client, GetFileOptions, InvokeApiOptions, InvokeApiResult } from ".";
import { GetManifestOptions, Manifest, ManifestFile } from ".";

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
   * @param options Configuration options for manifest retrieval
   * @param client The client instance requesting this invocation.
   * This client will be used for any sub-queries that occur.
   */
  public abstract async getManifest<T extends ManifestFile>(
    options: GetManifestOptions<T>,
    client: Client
  ): Promise<Manifest<T>>;

  /**
   * Get a file from the API package.
   * Not implemented for plugin packages.
   *
   * @param options Configuration options for file retrieval
   * @param client The client instance requesting this invocation.
   * This client will be used for any sub-queries that occur.
   */
  public abstract async getFile(
    options: GetFileOptions,
    client: Client
  ): Promise<ArrayBuffer | string>;
}

/** Cache of API definitions, mapping the API's URI to its definition */
export type ApiCache = Map<string, Api>;

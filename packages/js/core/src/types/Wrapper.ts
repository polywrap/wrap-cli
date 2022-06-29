import {Uri, Client, GetFileOptions, InvokeOptions, InvokeResult, GetManifestOptions} from ".";

/**
 * The Wrapper definition, which can be used to spawn
 * many invocations of this particular Wrapper. Internally
 * this class may do things like caching WASM bytecode, spawning
 * worker threads, or indexing into resolvers to find the requested method.
 */
export abstract class Wrapper {
  /**
   * Invoke the Wrapper based on the provided [[InvokeOptions]]
   *
   * @param options Options for this invocation.
   * @param client The client instance requesting this invocation.
   * This client will be used for any sub-invokes that occur.
   */
  public abstract invoke(
    options: InvokeOptions<Uri>,
    client: Client
  ): Promise<InvokeResult<unknown>>;

  /**
   * Get a file from the Wrapper package.
   * Not implemented for plugin wrappers.
   *
   * @param options Configuration options for file retrieval
   * @param client The client instance requesting the file.
   */
  public abstract getFile(
    options: GetFileOptions,
    client: Client
  ): Promise<ArrayBuffer | string>;

  /**
   * Get a manifest from the Wrapper package.
   * Not implemented for plugin wrappers.
   *
   * @param options Configuration options for manifest retrieval
   * @param client The client instance requesting the manifest.
   */
  public abstract getManifest(
    options: GetManifestOptions,
    client: Client
  ): Promise<string>;
}

/** Cache of Wrapper definitions, mapping the Wrapper's URI to its definition */
export type WrapperCache = Map<string, Wrapper>;

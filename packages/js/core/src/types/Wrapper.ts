import {
  Uri,
  Client,
  GetFileOptions,
  InvokeOptions,
  Invocable,
  Invoker,
  InvocableResult,
} from ".";

import { WrapManifest } from "@polywrap/wrap-manifest-types-js";

/**
 * The Wrapper definition, which can be used to spawn
 * many invocations of this particular Wrapper. Internally
 * this class may do things like caching WASM bytecode, spawning
 * worker threads, or indexing into resolvers to find the requested method.
 */
export abstract class Wrapper implements Invocable {
  /**
   * Invoke the Wrapper based on the provided [[InvokeOptions]]
   *
   * @param options Options for this invocation.
   * @param invoker The client instance requesting this invocation.
   * This client will be used for any sub-invokes that occur.
   */
  public abstract invoke(
    options: InvokeOptions<Uri>,
    invoker: Invoker
  ): Promise<InvocableResult<unknown>>;

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
  ): Promise<Uint8Array | string>;

  /**
   * Get a manifest from the Wrapper package.
   * Not implemented for plugin wrappers.
   *
   * @param client The client instance requesting the manifest.
   */
  public abstract getManifest(client: Client): Promise<WrapManifest>;
}

export type WrapperCache = Map<string, Wrapper>;

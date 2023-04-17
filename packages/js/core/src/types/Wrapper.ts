import {
  GetFileOptions,
  InvokeOptions,
  Invocable,
  Invoker,
  InvocableResult,
} from ".";

import { WrapManifest } from "@polywrap/wrap-manifest-types-js";
import { Result } from "@polywrap/result";

// $start: Wrapper.ts

/**
 * The Wrapper definition, which can be used to spawn
 * many invocations of this particular Wrapper. Internally
 * this class may do things like caching WASM bytecode, spawning
 * worker threads, or indexing into resolvers to find the requested method.
 */
export interface Wrapper extends Invocable {
  /**
   * Invoke the Wrapper based on the provided [[InvokeOptions]]
   *
   * @param options Options for this invocation.
   * @param invoker The client instance requesting this invocation.
   * This client will be used for any sub-invokes that occur.
   */
  invoke(
    options: InvokeOptions,
    invoker: Invoker
  ): Promise<InvocableResult<unknown>>;

  /**
   * Get a file from the Wrapper package.
   *
   * @param options Configuration options for file retrieval
   */
  getFile(options: GetFileOptions): Promise<Result<Uint8Array | string, Error>>;

  /**
   * Get a manifest from the Wrapper package.
   */
  getManifest(): WrapManifest;
}

// $end

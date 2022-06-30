import {
  Uri,
  Client,
  GetFileOptions,
  GetManifestOptions,
  InvokeOptions,
  Invocable,
  Invoker,
  InvocableResult,
} from ".";
import { AnyManifestArtifact, ManifestArtifactType } from "../manifest";

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
   * @param client The client instance requesting this invocation.
   * This client will be used for any sub-invokes that occur.
   */
  public abstract invoke(
    options: InvokeOptions<Uri>,
    invoker: Invoker
  ): Promise<InvocableResult<unknown>>;

  /**
   * Get the Wrapper's schema
   *
   * @param client The client instance the schema.
   */
  public abstract getSchema(client: Client): Promise<string>;

  /**
   * Get the Wrapper's manifest
   *
   * @param options Configuration options for manifest retrieval
   * @param client The client instance requesting the manifest.
   */
  public abstract getManifest<
    TManifestArtifactType extends ManifestArtifactType
  >(
    options: GetManifestOptions<TManifestArtifactType>,
    client: Client
  ): Promise<AnyManifestArtifact<TManifestArtifactType>>;

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
}

/** Cache of Wrapper definitions, mapping the Wrapper's URI to its definition */
export type WrapperCache = Map<string, Wrapper>;

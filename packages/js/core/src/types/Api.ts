import {
  Uri,
  Client,
  GetFileOptions,
  GetManifestOptions,
  InvokeApiOptions,
  InvokeApiResult,
} from ".";
import { AnyManifestArtifact, ManifestArtifactType } from "../manifest";

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
    options: InvokeApiOptions<Uri>,
    client: Client
  ): Promise<InvokeApiResult<unknown>>;

  /**
   * Get the API's schema
   *
   * @param client The client instance the schema.
   */
  public abstract async getSchema(client: Client): Promise<string>;

  /**
   * Get the API's manifest
   *
   * @param options Configuration options for manifest retrieval
   * @param client The client instance requesting the manifest.
   */
  public abstract async getManifest<
    TManifestArtifactType extends ManifestArtifactType
  >(
    options: GetManifestOptions<TManifestArtifactType>,
    client: Client
  ): Promise<AnyManifestArtifact<TManifestArtifactType>>;

  /**
   * Get a file from the API package.
   * Not implemented for plugin apis.
   *
   * @param options Configuration options for file retrieval
   * @param client The client instance requesting the file.
   */
  public abstract async getFile(
    options: GetFileOptions,
    client: Client
  ): Promise<ArrayBuffer | string>;
}

/** Cache of API definitions, mapping the API's URI to its definition */
export type ApiCache = Map<string, Api>;

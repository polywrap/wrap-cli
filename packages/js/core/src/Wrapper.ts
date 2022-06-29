import {
  Uri,
  Client,
  GetFileOptions,
  InvokeOptions,
  InvokeResult,
} from ".";
import { WrapManifest } from "../wrap-manifests";

// wrapper
// - package
// - uri

/**
 * The Wrapper definition, which can be used to spawn
 * many invocations of this particular Wrapper. Internally
 * this class may do things like caching WASM bytecode, spawning
 * worker threads, or indexing into resolvers to find the requested method.
 */
export abstract class Wrapper<
  TType extends WrapManifest["type"]
>{
  constructor(
    type: TType,
    manifest: WrapManifest
  ) {
    if (type !== manifest.type) {
      throw Error(lksjdflkjsadflkjsdlkfj);
    }
  }

  /**
   * Get the Wrapper's schema
   *
   * @param client The client instance the schema.
   */
  public abstract getSchema(client: Client): Promise<string>;

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
}

/** Cache of Wrapper definitions, mapping the Wrapper's URI to its definition */
export type WrapperCache = Map<string, Wrapper>;

import {
  Client,
  GetFileOptions,
  GetManifestOptions,
  InvokeApiOptions,
  InvokeApiResult,
} from ".";
import { AnyManifest, ManifestType } from "../manifest";

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
  public abstract async getManifest<TManifestType extends ManifestType>(
    options: GetManifestOptions<TManifestType>,
    client: Client
  ): Promise<AnyManifest<TManifestType>>;

  /**
   * Get a file from the API package.
   * Not implemented for plugin packages.
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

export interface ApiCacheConfig {
  maxWrappers?: number;
  staleThreshold?: number;
}

type ApiData = { uris: Set<string>; lastQuery: number };

/** Cache of API definitions, mapping the API's URI to its definition */
export class ManagedApiCache {
  config: ApiCacheConfig;
  cache: ApiCache;
  private reverseLookup: Map<Api, ApiData>;

  constructor(config: ApiCacheConfig) {
    this.config = config;
    this.cache = new Map<string, Api>();
    this.reverseLookup = new Map<Api, ApiData>();
  }

  set(key: string, value: Api): this {
    // if key is associated with a different api, remove old value first
    if (this.cache.get(key)) {
      this.delete(key);
    }
    // get current api stats
    let stats: ApiData | undefined = this.reverseLookup.get(value);
    if (!stats) {
      stats = {
        uris: new Set<string>(),
        lastQuery: 0,
      };
      this.reverseLookup.set(value, stats);
    }
    // set cache value and update stats
    this.cache.set(key, value);
    stats.uris.add(key);
    stats.lastQuery = 0;
    // gc
    this.collectExcess();
    return this;
  }

  get(key: string): Api | undefined {
    // get cached value and update stats
    const api = this.cache.get(key);
    if (api) {
      const stats: ApiData | undefined = this.reverseLookup.get(api);
      if (!stats) {
        throw Error(
          `ApiInfo missing for polywrapper at ${key}. This should never happen.`
        );
      }
      stats.lastQuery = -1;
      // gc
      this.collectStale();
    }
    return api;
  }

  delete(key: string): boolean {
    const api: Api | undefined = this.cache.get(key);
    if (!api) {
      return false;
    }
    const uris: Set<string> | undefined = this.reverseLookup.get(api)?.uris;
    if (!uris) {
      return false;
    }
    uris.delete(key);
    if (uris.size === 0) {
      this.reverseLookup.delete(api);
    }
    return this.cache.delete(key);
  }

  deleteApi(api: Api): boolean {
    const uris: Set<string> | undefined = this.reverseLookup.get(api)?.uris;
    if (!uris) {
      return false;
    }
    this.reverseLookup.delete(api);
    for (const uri of uris) {
      if (!this.cache.delete(uri)) {
        throw Error(
          `Tried to delete an api cache entry that does not exist: ${uri}`
        );
      }
    }
    return true;
  }

  private collectExcess(): boolean {
    // check if need to collect
    if (
      this.config.maxWrappers === undefined ||
      this.reverseLookup.size <= this.config.maxWrappers
    ) {
      return false;
    }
    // find Api queried least recently
    let oldest: Api | undefined = undefined;
    let age: number = Number.MIN_SAFE_INTEGER;
    for (const [api, apiInfo] of this.reverseLookup.entries()) {
      if (apiInfo.lastQuery > age) {
        age = apiInfo.lastQuery;
        oldest = api;
      }
    }
    // remove oldest Api
    return oldest !== undefined && this.deleteApi(oldest);
  }

  private collectStale(): boolean {
    // check if need to collect
    if (this.config.staleThreshold === undefined) {
      return false;
    }
    // iterate query counters and mark stale entries
    const staleEntries: Api[] = [];
    for (const [api, apiInfo] of this.reverseLookup.entries()) {
      apiInfo.lastQuery++;
      if (apiInfo.lastQuery >= this.config.staleThreshold) {
        staleEntries.push(api);
      }
    }
    // remove stale entries
    for (const api of staleEntries) {
      this.deleteApi(api);
    }
    return staleEntries.length > 0;
  }
}

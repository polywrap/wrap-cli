import { IWrapperCache } from "./IWrapperCache";
import { UriResolutionResult, UriResolver, UriResolverLike } from "../helpers";

import {
  IUriResolver,
  Uri,
  CoreClient,
  IUriResolutionContext,
  UriPackageOrWrapper,
} from "@polywrap/core-js";
import { DeserializeManifestOptions } from "@polywrap/wrap-manifest-types-js";
import { Result } from "@polywrap/result";
import { Mutex, MutexInterface } from "async-mutex";

export class EcoCacheResolver<TError> implements IUriResolver<TError | Error> {
  private locks: Map<
    string,
    { mutex: Mutex; release?: MutexInterface.Releaser }
  > = new Map();

  constructor(
    private _resolverToCache: IUriResolver<TError>,
    private _cache: IWrapperCache,
    private _options?: {
      deserializeManifestOptions?: DeserializeManifestOptions;
    }
  ) {}

  static from<TResolverError = unknown>(
    resolver: UriResolverLike,
    cache: IWrapperCache,
    options?: { deserializeManifestOptions?: DeserializeManifestOptions }
  ): EcoCacheResolver<TResolverError> {
    return new EcoCacheResolver(
      UriResolver.from<TResolverError>(resolver),
      cache,
      options
    );
  }

  async isCached(uri: Uri): Promise<boolean> {
    return Boolean(await this._cache.get(uri));
  }

  isLocked(uri: Uri): boolean {
    return this.locks.has(uri.uri);
  }

  async tryResolveUri(
    uri: Uri,
    client: CoreClient,
    resolutionContext: IUriResolutionContext
  ): Promise<Result<UriPackageOrWrapper, TError | Error>> {
    await this.acquireMutex(uri);

    const wrapper = await this._cache.get(uri);

    // return from cache if available
    if (wrapper) {
      const result = UriResolutionResult.ok(uri, wrapper);

      resolutionContext.trackStep({
        sourceUri: uri,
        result,
        description: "EcoCacheResolver (Cache)",
      });
      return result;
    }

    // resolve uri if not in cache
    const subContext = resolutionContext.createSubHistoryContext();

    let result: Result<
      UriPackageOrWrapper,
      TError | Error
    > = await this._resolverToCache.tryResolveUri(uri, client, subContext);

    if (result.ok) {
      result = await this.cacheResult(result, subContext);
      this.cancelMutex(uri);
    }

    resolutionContext.trackStep({
      sourceUri: uri,
      result,
      subHistory: subContext.getHistory(),
      description: "EcoCacheResolver",
    });
    return result;
  }

  private async cacheResult(
    result: Result<UriPackageOrWrapper, TError | Error>,
    subContext: IUriResolutionContext
  ): Promise<Result<UriPackageOrWrapper, TError | Error>> {
    if (!result.ok || result.value.type === "uri") {
      return result;
    } else if (result.value.type === "package") {
      const wrapPackage = result.value.package;
      const resolutionPath: Uri[] = subContext.getResolutionPath();

      const createResult = await wrapPackage.createWrapper({
        noValidate: this._options?.deserializeManifestOptions?.noValidate,
      });

      if (!createResult.ok) {
        return createResult;
      }

      const wrapper = createResult.value;

      for (const uri of resolutionPath) {
        await this._cache.set(uri, wrapper);
      }

      return UriResolutionResult.ok(result.value.uri, wrapper);
    } else {
      const wrapper = result.value.wrapper;
      const resolutionPath: Uri[] = subContext.getResolutionPath();

      for (const uri of resolutionPath) {
        await this._cache.set(uri, wrapper);
      }

      return result;
    }
  }

  private async acquireMutex(uri: Uri): Promise<void> {
    const isCached = Boolean(await this._cache.get(uri));
    if (!isCached) {
      let lock = this.locks.get(uri.uri);
      if (!lock) {
        lock = { mutex: new Mutex() };
        this.locks.set(uri.uri, lock);
      }
      lock.release = await lock.mutex.acquire().catch((_e) => undefined);
    }
  }

  private cancelMutex(uri: Uri): void {
    const uriStr = uri.uri;
    const lock = this.locks.get(uriStr);
    if (!lock) return;
    lock.mutex.cancel();
    this.locks.delete(uriStr);
  }
}

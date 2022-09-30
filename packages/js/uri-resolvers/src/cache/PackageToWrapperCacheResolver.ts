import { IWrapperCache } from "./IWrapperCache";
import {
  buildUriResolver,
  UriResolutionResult,
  UriResolverLike,
} from "../helpers";

import {
  IUriResolver,
  Uri,
  Client,
  executeMaybeAsyncFunction,
  Wrapper,
  IUriResolutionContext,
  UriPackageOrWrapper,
} from "@polywrap/core-js";
import { DeserializeManifestOptions } from "@polywrap/wrap-manifest-types-js";
import { Result } from "@polywrap/result";

export class PackageToWrapperCacheResolver<TError>
  implements IUriResolver<TError | Error> {
  name: string;

  constructor(
    private resolverToCache: IUriResolver<TError>,
    private cache: IWrapperCache,
    private options?: {
      deserializeManifestOptions?: DeserializeManifestOptions;
      endOnRedirect?: boolean;
    }
  ) {}

  static from<TResolverError = unknown>(
    resolver: UriResolverLike,
    cache: IWrapperCache,
    options?: {
      deserializeManifestOptions?: DeserializeManifestOptions;
      endOnRedirect?: boolean;
    }
  ): PackageToWrapperCacheResolver<TResolverError> {
    return new PackageToWrapperCacheResolver(
      buildUriResolver<TResolverError>(resolver),
      cache,
      options
    );
  }

  async tryResolveUri(
    uri: Uri,
    client: Client,
    resolutionContext: IUriResolutionContext
  ): Promise<Result<UriPackageOrWrapper, TError | Error>> {
    const wrapper = await executeMaybeAsyncFunction<Wrapper | undefined>(
      this.cache.get.bind(this.cache, uri)
    );

    if (wrapper) {
      const result = UriResolutionResult.ok(uri, wrapper);

      resolutionContext.trackStep({
        sourceUri: uri,
        result,
        description: "PackageToWrapperCacheResolver (Cache)",
      });
      return result;
    }

    const subContext = resolutionContext.createSubHistoryContext();

    let result = await this.resolverToCache.tryResolveUri(
      uri,
      client,
      subContext
    );

    if (result.ok) {
      if (result.value.type === "package") {
        const wrapPackage = result.value.package;
        const resolutionPath: Uri[] = subContext.getResolutionPath();

        const createResult = await wrapPackage.createWrapper({
          noValidate: this.options?.deserializeManifestOptions?.noValidate,
        });

        if (!createResult.ok) {
          return createResult;
        }

        const wrapper = createResult.value;

        for (const uri of resolutionPath) {
          await executeMaybeAsyncFunction<Wrapper | undefined>(
            this.cache.set.bind(this.cache, uri, wrapper)
          );
        }

        result = UriResolutionResult.ok(result.value.uri, wrapper);
      } else if (result.value.type === "wrapper") {
        const wrapper = result.value.wrapper;
        const resolutionPath: Uri[] = subContext.getResolutionPath();

        for (const uri of resolutionPath) {
          await executeMaybeAsyncFunction<Wrapper | undefined>(
            this.cache.set.bind(this.cache, uri, wrapper)
          );
        }
      }
    }

    resolutionContext.trackStep({
      sourceUri: uri,
      result,
      subHistory: subContext.getHistory(),
      description: "PackageToWrapperCacheResolver",
    });
    return result;
  }
}

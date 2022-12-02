import { IWrapperCache } from "./IWrapperCache";
import { UriResolver, UriResolutionResult, UriResolverLike } from "../helpers";

import {
  IUriResolver,
  Uri,
  CoreClient,
  IUriResolutionContext,
  UriPackageOrWrapper,
} from "@polywrap/core-js";
import { Result } from "@polywrap/result";

export class PackageToWrapperCacheResolver<TError>
  implements IUriResolver<TError | Error> {
  name: string;

  constructor(
    private resolverToCache: IUriResolver<TError>,
    private cache: IWrapperCache,
    private options?: {
      deserializeManifestOptions?: unknown;
      endOnRedirect?: boolean;
    }
  ) {}

  static from<TResolverError = unknown>(
    resolver: UriResolverLike,
    cache: IWrapperCache,
    options?: {
      deserializeManifestOptions?: unknown;
      endOnRedirect?: boolean;
    }
  ): PackageToWrapperCacheResolver<TResolverError> {
    return new PackageToWrapperCacheResolver(
      UriResolver.from<TResolverError>(resolver),
      cache,
      options
    );
  }

  getOptions(): unknown {
    return this.options;
  }

  async tryResolveUri(
    uri: Uri,
    client: CoreClient,
    resolutionContext: IUriResolutionContext
  ): Promise<Result<UriPackageOrWrapper, TError | Error>> {
    const wrapper = await this.cache.get(uri);

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
          noValidate: true,
        });

        if (!createResult.ok) {
          return createResult;
        }

        const wrapper = createResult.value;

        for (const uri of resolutionPath) {
          await this.cache.set(uri, wrapper);
        }

        result = UriResolutionResult.ok(result.value.uri, wrapper);
      } else if (result.value.type === "wrapper") {
        const wrapper = result.value.wrapper;
        const resolutionPath: Uri[] = subContext.getResolutionPath();

        for (const uri of resolutionPath) {
          await this.cache.set(uri, wrapper);
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

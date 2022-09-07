import { IWrapperCache } from "./IWrapperCache";

import {
  IUriResolver,
  Uri,
  Client,
  executeMaybeAsyncFunction,
  Wrapper,
  IUriResolutionContext,
  UriPackageOrWrapper,
  UriResolutionResult,
  UriResolutionContext,
} from "@polywrap/core-js";
import { DeserializeManifestOptions } from "@polywrap/wrap-manifest-types-js";
import { Result } from "@polywrap/result";
import { UriResolverLike } from "../helpers";
import { buildUriResolver } from "../utils";

export type ResolutionCallback<TError> = (
  response: Result<UriPackageOrWrapper, TError>
) => void;

export class PackageToWrapperCacheResolver<TError = undefined>
  implements IUriResolver<TError> {
  name: string;
  resolverToCache: IUriResolver<TError>;

  constructor(
    private cache: IWrapperCache,
    resolverToCache: UriResolverLike,
    private options?: {
      deserializeManifestOptions?: DeserializeManifestOptions;
      resolverName: string;
      endOnRedirect?: boolean;
    }
  ) {
    this.resolverToCache = buildUriResolver(
      resolverToCache,
      options?.resolverName
    );
  }

  async tryResolveUri(
    uri: Uri,
    client: Client,
    resolutionContext: IUriResolutionContext
  ): Promise<Result<UriPackageOrWrapper, TError>> {
    const wrapper = await executeMaybeAsyncFunction<Wrapper | undefined>(
      this.cache.get.bind(this.cache, uri)
    );

    if (wrapper) {
      const result = UriResolutionResult.ok(wrapper);

      resolutionContext.trackStep({
        sourceUri: uri,
        result,
        description: "PackageToWrapperCacheResolver (Cache)",
      });
      return result;
    }

    const subContext = UriResolutionContext.createNested(resolutionContext);

    let result = await this.resolverToCache.tryResolveUri(
      uri,
      client,
      subContext
    );

    if (result.ok) {
      if (result.value.type === "package") {
        const wrapPackage = result.value.package;
        const visitedUris: Uri[] = subContext.getVisitedUris();

        const wrapper = await wrapPackage.createWrapper(client, visitedUris, {
          noValidate: this.options?.deserializeManifestOptions?.noValidate,
        });

        for (const uri of visitedUris) {
          await executeMaybeAsyncFunction<Wrapper | undefined>(
            this.cache.set.bind(this.cache, uri, wrapper)
          );
        }

        result = UriResolutionResult.ok(wrapper);
      } else if (result.value.type === "wrapper") {
        const wrapper = result.value.wrapper;
        const visitedUris: Uri[] = subContext.getVisitedUris();

        for (const uri of visitedUris) {
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

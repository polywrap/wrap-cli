import { UriResolverLike } from "../UriResolverLike";
import { buildUriResolver } from "../buildUriResolver";

import {
  IUriResolver,
  Uri,
  Client,
  executeMaybeAsyncFunction,
  Wrapper,
  IUriResolutionContext,
  UriPackageOrWrapper,
  UriResolutionResult,
} from "@polywrap/core-js";
import { IWrapperCache } from "./IWrapperCache";
import { DeserializeManifestOptions } from "@polywrap/wrap-manifest-types-js";
import { Result } from "@polywrap/result";

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
        description: "Cache",
      });
      return result;
    }

    let result = await this.resolverToCache.tryResolveUri(
      uri,
      client,
      resolutionContext
    );

    if (result.ok) {
      if (result.value.type === "package") {
        const wrapPackage = result.value.package;
        const visitedUris: Uri[] = resolutionContext.getVisitedUris();

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
        const visitedUris: Uri[] = resolutionContext.getVisitedUris();

        for (const uri of visitedUris) {
          await executeMaybeAsyncFunction<Wrapper | undefined>(
            this.cache.set.bind(this.cache, uri, wrapper)
          );
        }
      }
    }

    return result;
  }
}

import { IWrapperCache } from "./IWrapperCache";
import { UriResolverLike } from "../helpers";
import { buildUriResolver } from "../utils";

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
      resolverName?: string;
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

        const wrapper = await wrapPackage.createWrapper({
          noValidate: this.options?.deserializeManifestOptions?.noValidate,
        });

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

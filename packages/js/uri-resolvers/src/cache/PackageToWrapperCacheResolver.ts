import { IWrapperCache } from "./IWrapperCache";
import { UriResolverLike } from "../helpers";
import { buildUriResolver } from "../utils";

import {
  IUriResolver,
  Uri,
  Client,
  IUriResolutionContext,
  UriPackageOrWrapper,
  UriResolutionResult,
} from "@polywrap/core-js";
import { DeserializeManifestOptions } from "@polywrap/wrap-manifest-types-js";
import { Result } from "@polywrap/result";

export class PackageToWrapperCacheResolver implements IUriResolver<Error> {
  name: string;
  resolverToCache: IUriResolver<Error>;

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
  ): Promise<Result<UriPackageOrWrapper, Error>> {
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
          noValidate: this.options?.deserializeManifestOptions?.noValidate,
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

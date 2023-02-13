import { UriResolverLike } from "./UriResolverLike";
import { UriResolver } from "./UriResolver";
import { UriResolutionResult } from "./UriResolutionResult";

import {
  CoreClient,
  IUriResolutionContext,
  IUriResolver,
  Result,
  Uri,
  UriPackageOrWrapper,
} from "@polywrap/core-js";

/** configure how additional resolution attempts are handled after an initial resolution attempt fails */
export type RetryOptions = {
  /** the number of additional resolution attempts */
  retries: number;
  /** the duration (in ms) to pause between attempts */
  interval: number;
};

/** A map or uri or authority strings to retry options */
export type RetryResolverOptions = {
  [uriOrAuthority: string]: RetryOptions;
};

export class RetryResolver<TError = undefined> implements IUriResolver<TError> {
  constructor(
    private resolver: IUriResolver<TError>,
    private options: RetryResolverOptions
  ) {}

  static from<TResolverError = unknown>(
    resolver: UriResolverLike,
    options: RetryResolverOptions
  ): RetryResolver<TResolverError> {
    return new RetryResolver(
      UriResolver.from<TResolverError>(resolver),
      options
    );
  }

  async tryResolveUri(
    uri: Uri,
    client: CoreClient,
    resolutionContext: IUriResolutionContext
  ): Promise<Result<UriPackageOrWrapper, TError>> {
    const subContext = resolutionContext.createSubHistoryContext();

    const result = await this.resolver.tryResolveUri(uri, client, subContext);

    const isChange = !(
      result.ok &&
      result.value.type === "uri" &&
      result.value.uri.uri === uri.uri
    );

    if (isChange) {
      resolutionContext.trackStep({
        sourceUri: uri,
        result,
        subHistory: subContext.getHistory(),
        description: "RetryResolver",
      });
      return result;
    }

    let retries = 0;
    let interval = 0;
    if (uri.uri in this.options) {
      const uriOrAuthority = this.options[uri.uri];
      retries = uriOrAuthority.retries;
      interval = uriOrAuthority.interval;
    } else if (uri.authority in this.options) {
      const uriOrAuthority = this.options[uri.authority];
      retries = uriOrAuthority.retries;
      interval = uriOrAuthority.interval;
    }

    while (retries-- > 0) {
      // sleep
      await new Promise((r) => setTimeout(r, interval));
      const result = await this.resolver.tryResolveUri(uri, client, subContext);

      const isChange = !(
        result.ok &&
        result.value.type === "uri" &&
        result.value.uri.uri === uri.uri
      );

      if (isChange) {
        resolutionContext.trackStep({
          sourceUri: uri,
          result,
          subHistory: subContext.getHistory(),
          description: "RetryResolver",
        });
        return result;
      }
    }

    const noResolution = UriResolutionResult.ok(uri);

    resolutionContext.trackStep({
      sourceUri: uri,
      result: noResolution,
      subHistory: subContext.getHistory(),
      description: "RetryResolver",
    });

    return noResolution;
  }
}

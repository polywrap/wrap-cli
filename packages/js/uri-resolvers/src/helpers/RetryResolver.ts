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

/**
 * configure how additional resolution attempts are handled after an initial resolution attempt fails
 * @property retries the number of additional resolution attempts
 * @property interval the duration (in ms) to pause between attempts
 * @property callback a function that returns true if the resolution attempt should be retried
 */
export type RetryOptions = {
  retries: number;
  interval?: number;
  callback?: (uriOrAuthority: string) => boolean;
};

/** A map of uri or authority strings to retry options */
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

    let uriOrAuthority: string | undefined = undefined;
    let options: RetryOptions | undefined = undefined;
    if (uri.uri in this.options) {
      uriOrAuthority = uri.uri;
      options = this.options[uriOrAuthority];
    } else if (uri.authority in this.options) {
      uriOrAuthority = uri.authority;
      options = this.options[uriOrAuthority];
    }

    let retries = options?.retries ?? 0;
    const interval = options?.interval ?? 0;

    if (
      uriOrAuthority &&
      this.options[uriOrAuthority].callback?.(uriOrAuthority)
    ) {
      while (retries-- > 0) {
        // sleep
        await new Promise((r) => setTimeout(r, interval));
        const result = await this.resolver.tryResolveUri(
          uri,
          client,
          subContext
        );

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
            description: "RetryResolver (Retry)",
          });
          return result;
        }
      }
    }

    const noResolution = UriResolutionResult.ok(uri);

    resolutionContext.trackStep({
      sourceUri: uri,
      result: noResolution,
      subHistory: subContext.getHistory(),
      description: "RetryResolver - Miss",
    });

    return noResolution;
  }
}

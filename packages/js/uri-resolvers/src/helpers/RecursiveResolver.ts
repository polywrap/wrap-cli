import { InfiniteLoopError } from "./InfiniteLoopError";
import { UriResolverLike } from "./UriResolverLike";
import { UriResolutionResult } from "./UriResolutionResult";
import { UriResolver } from "./UriResolver";

import { Result } from "@polywrap/result";
import {
  IUriResolver,
  Uri,
  CoreClient,
  IUriResolutionContext,
  UriPackageOrWrapper,
} from "@polywrap/core-js";

export class RecursiveResolver<TError = undefined>
  implements IUriResolver<TError | InfiniteLoopError> {
  constructor(private _resolver: IUriResolver<TError>) {}

  static from<TResolverError = unknown>(
    resolver: UriResolverLike
  ): RecursiveResolver<TResolverError> {
    return new RecursiveResolver(UriResolver.from<TResolverError>(resolver));
  }

  async tryResolveUri(
    uri: Uri,
    client: CoreClient,
    resolutionContext: IUriResolutionContext
  ): Promise<Result<UriPackageOrWrapper, TError | InfiniteLoopError>> {
    if (resolutionContext.isResolving(uri)) {
      return UriResolutionResult.err(
        new InfiniteLoopError(uri, resolutionContext.getHistory())
      );
    }

    resolutionContext.startResolving(uri);

    const resolverResult = await this._resolver.tryResolveUri(
      uri,
      client,
      resolutionContext
    );

    const result = await this._tryResolveAgainIfRedirect(
      resolverResult,
      uri,
      client,
      resolutionContext
    );

    resolutionContext.stopResolving(uri);

    return result;
  }

  private async _tryResolveAgainIfRedirect(
    result: Result<UriPackageOrWrapper, TError | InfiniteLoopError>,
    uri: Uri,
    client: CoreClient,
    resolutionContext: IUriResolutionContext
  ): Promise<Result<UriPackageOrWrapper, TError | InfiniteLoopError>> {
    if (result.ok && result.value.type === "uri") {
      const resultUri = result.value.uri;

      if (resultUri.uri !== uri.uri) {
        result = await this.tryResolveUri(resultUri, client, resolutionContext);
      }
    }

    return result;
  }
}

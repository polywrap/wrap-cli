import { InfiniteLoopError } from "./InfiniteLoopError";
import { UriResolverLike } from "./UriResolverLike";
import { UriResolutionResult } from "./UriResolutionResult";
import { buildUriResolver } from "./buildUriResolver";

import { Result } from "@polywrap/result";
import {
  IUriResolver,
  Uri,
  Client,
  IUriResolutionContext,
  UriPackageOrWrapper,
} from "@polywrap/core-js";

export class RecursiveResolver<TError = undefined>
  implements IUriResolver<TError | InfiniteLoopError> {
  private resolver: IUriResolver<TError>;

  constructor(resolver: UriResolverLike) {
    this.resolver = buildUriResolver(resolver);
  }

  async tryResolveUri(
    uri: Uri,
    client: Client,
    resolutionContext: IUriResolutionContext
  ): Promise<Result<UriPackageOrWrapper, TError | InfiniteLoopError>> {
    if (resolutionContext.isResolving(uri)) {
      return UriResolutionResult.err(
        new InfiniteLoopError(uri, resolutionContext.getHistory())
      );
    }

    resolutionContext.startResolving(uri);

    const resolverResult = await this.resolver.tryResolveUri(
      uri,
      client,
      resolutionContext
    );

    const result = await this.tryResolveAgainIfRedirect(
      resolverResult,
      uri,
      client,
      resolutionContext
    );

    resolutionContext.stopResolving(uri);

    return result;
  }

  private async tryResolveAgainIfRedirect(
    result: Result<UriPackageOrWrapper, TError | InfiniteLoopError>,
    uri: Uri,
    client: Client,
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

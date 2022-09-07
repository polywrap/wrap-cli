import { InfiniteLoopError } from "./InfiniteLoopError";

import {
  IUriResolver,
  Uri,
  Client,
  IUriResolutionContext,
  UriPackageOrWrapper,
  UriResolutionResult,
} from "@polywrap/core-js";
import { Result } from "@polywrap/result";

export class RecursiveResolver<TError = undefined>
  implements IUriResolver<TError | InfiniteLoopError> {
  constructor(private resolver: IUriResolver<TError>) {}

  async tryResolveUri(
    uri: Uri,
    client: Client,
    resolutionContext: IUriResolutionContext
  ): Promise<Result<UriPackageOrWrapper, TError | InfiniteLoopError>> {
    if (resolutionContext.hasVisited(uri)) {
      return UriResolutionResult.err(
        new InfiniteLoopError(uri, resolutionContext.getHistory())
      );
    }

    resolutionContext.visit(uri);

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

    resolutionContext.unvisit(uri);

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

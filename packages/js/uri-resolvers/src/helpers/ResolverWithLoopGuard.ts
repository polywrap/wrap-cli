import { InfiniteLoopError } from "./InfiniteLoopError";
import { UriResolverLike } from "../helpers";
import { buildUriResolver } from "../utils";

import { Result } from "@polywrap/result";
import {
  IUriResolver,
  Uri,
  Client,
  IUriResolutionContext,
  UriPackageOrWrapper,
  UriResolutionResult,
} from "@polywrap/core-js";

export class ResolverWithLoopGuard<TError = undefined>
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
    if (resolutionContext.hasVisited(uri)) {
      return UriResolutionResult.err(
        new InfiniteLoopError(uri, resolutionContext.getHistory())
      );
    }

    resolutionContext.visit(uri);

    const result = await this.resolver.tryResolveUri(
      uri,
      client,
      resolutionContext
    );

    resolutionContext.unvisit(uri);

    return result;
  }
}

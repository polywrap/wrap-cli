import { InfiniteLoopError } from "./InfiniteLoopError";

import { Result } from "@polywrap/result";
import {
  IUriResolver,
  Uri,
  Client,
  IUriResolutionContext,
  UriPackageOrWrapper,
} from "@polywrap/core-js";
import { UriResolverLike } from "./UriResolverLike";
import { UriResolutionResult } from "./UriResolutionResult";
import { buildUriResolver } from "./buildUriResolver";

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
    if (resolutionContext.isResolving(uri)) {
      return UriResolutionResult.err(
        new InfiniteLoopError(uri, resolutionContext.getHistory())
      );
    }

    resolutionContext.startResolving(uri);

    const result = await this.resolver.tryResolveUri(
      uri,
      client,
      resolutionContext
    );

    resolutionContext.stopResolving(uri);

    return result;
  }
}

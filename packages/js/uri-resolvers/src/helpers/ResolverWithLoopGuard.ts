import { InfiniteLoopError } from "./InfiniteLoopError";
import { UriResolverLike } from "./UriResolverLike";
import { UriResolutionResult } from "./UriResolutionResult";
import { UriResolver } from "./UriResolver";

import {
  IUriResolver,
  Uri,
  Client,
  IUriResolutionContext,
  UriPackageOrWrapper,
} from "@polywrap/core-js";
import { Result } from "@polywrap/result";

export class ResolverWithLoopGuard<TError = undefined>
  implements IUriResolver<TError | InfiniteLoopError> {
  constructor(private resolver: IUriResolver<TError>) {}

  static from<TResolverError = unknown>(
    resolver: UriResolverLike
  ): ResolverWithLoopGuard<TResolverError> {
    return new ResolverWithLoopGuard(
      UriResolver.from<TResolverError>(resolver)
    );
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

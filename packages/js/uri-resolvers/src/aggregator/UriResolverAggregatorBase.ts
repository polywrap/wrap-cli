import { InfiniteLoopError } from "../InfiniteLoopError";

import {
  IUriResolver,
  Uri,
  Client,
  IUriResolutionContext,
  UriResolutionContext,
  UriResolutionResult,
  UriPackageOrWrapper,
} from "@polywrap/core-js";
import { Result } from "@polywrap/result";
import { ContextfulResolver } from "../base";

export abstract class UriResolverAggregatorBase<
  TResolutionError = undefined,
  TGetResolversError = undefined
> extends ContextfulResolver<TResolutionError | TGetResolversError> {
  constructor(resolverName?: string, fullResolution?: boolean) {
    super(resolverName ?? "UriResolverAggregator", fullResolution);
  }

  abstract getUriResolvers(
    uri: Uri,
    client: Client,
    resolutionContext?: IUriResolutionContext
  ): Promise<
    Result<IUriResolver<unknown>[], TGetResolversError | InfiniteLoopError>
  >;

  async tryResolveUriWithContext(
    uri: Uri,
    client: Client,
    resolutionContext: IUriResolutionContext
  ): Promise<
    Result<
      UriPackageOrWrapper,
      TResolutionError | TGetResolversError | InfiniteLoopError
    >
  > {
    const result = await this.getUriResolvers(uri, client, resolutionContext);

    if (!result.ok) {
      return result;
    }

    const resolvers = result.value as IUriResolver[];

    return await this.tryResolveUriWithResolvers(
      uri,
      client,
      resolvers,
      resolutionContext
    );
  }

  protected async tryResolveUriWithResolvers(
    currentUri: Uri,
    client: Client,
    resolvers: IUriResolver<unknown>[],
    resolutionContext: IUriResolutionContext
  ): Promise<
    Result<UriPackageOrWrapper, TResolutionError | InfiniteLoopError>
  > {
    for (const resolver of resolvers) {
      const subContext = UriResolutionContext.createNested(resolutionContext);

      const typeResolver = resolver as IUriResolver<
        TResolutionError | InfiniteLoopError
      >;

      const result = await typeResolver.tryResolveUri(
        currentUri,
        client,
        subContext
      );

      resolutionContext.trackStep({
        sourceUri: currentUri,
        result,
        subHistory: subContext.getHistory(),
      });

      if (
        result.ok &&
        result.value.type === "uri" &&
        result.value.uri === currentUri
      ) {
        continue;
      } else {
        return result;
      }
    }

    return UriResolutionResult.ok(currentUri);
  }
}

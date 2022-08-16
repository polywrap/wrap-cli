import { Tracer } from "@polywrap/tracing-js";
import { InfiniteLoopError } from "..";
import { Client, Result, Uri, WrapperCache } from "../../..";
import { UriResolutionResult } from "../../core";
import {
  IUriResolutionResult,
  IUriResolver,
  IUriResolutionStep,
  getUriResolutionPath,
} from "../../core";

export abstract class UriResolverAggregatorBase<TError = undefined>
  implements IUriResolver<TError | InfiniteLoopError> {
  constructor(private readonly options: { fullResolution: boolean }) {}

  abstract get name(): string;

  abstract getUriResolvers(
    uri: Uri,
    client: Client,
    cache: WrapperCache
  ): Promise<Result<IUriResolver<unknown>[], TError | InfiniteLoopError>>;

  async tryResolveToWrapper(
    uri: Uri,
    client: Client,
    cache: WrapperCache
  ): Promise<IUriResolutionResult<TError | InfiniteLoopError>> {
    const result = await this.getUriResolvers(uri, client, cache);

    if (!result.ok) {
      return UriResolutionResult.err(result.error);
    }

    const resolvers = result.value as IUriResolver[];

    return await this.tryResolveToWrapperWithResolvers(
      uri,
      client,
      cache,
      resolvers
    );
  }

  protected async tryResolveToWrapperWithResolvers(
    uri: Uri,
    client: Client,
    cache: WrapperCache,
    resolvers: IUriResolver<unknown>[]
  ): Promise<IUriResolutionResult<TError | InfiniteLoopError>> {
    // Keep track of past URIs to avoid infinite loops
    const visitedUriMap: Map<string, boolean> = new Map<string, boolean>();
    const history: IUriResolutionStep<unknown>[] = [];

    let currentUri: Uri = uri;

    let runAgain = true;

    while (runAgain) {
      runAgain = false;

      const { infiniteLoopDetected } = trackVisitedUri(
        currentUri.uri,
        visitedUriMap
      );

      for (const resolver of resolvers) {
        if (infiniteLoopDetected) {
          return UriResolutionResult.err(
            new InfiniteLoopError(currentUri, history),
            history
          );
        }

        const result = await resolver.tryResolveToWrapper(
          currentUri,
          client,
          cache,
          getUriResolutionPath(history)
        );

        history.push({
          resolverName: resolver.name,
          sourceUri: currentUri,
          result,
        });

        if (!result.response.ok) {
          return UriResolutionResult.err(
            result.response.error as TError,
            history
          );
        } else if (result.response.ok) {
          const uriPackageOrWrapper = result.response.value;

          if (uriPackageOrWrapper.type === "uri") {
            const resultUri = uriPackageOrWrapper.uri;

            Tracer.addEvent("uri-resolver-redirect", {
              from: currentUri.uri,
              to: resultUri.uri,
            });

            if (resultUri.uri === currentUri.uri) {
              continue;
            }

            currentUri = resultUri;

            if (this.options.fullResolution) {
              runAgain = true;
            }
            break;
          } else {
            return UriResolutionResult.ok(uriPackageOrWrapper, history);
          }
        }
      }
    }

    return UriResolutionResult.ok(currentUri, history);
  }
}

const trackVisitedUri = (uri: string, visitedUriMap: Map<string, boolean>) => {
  if (visitedUriMap.has(uri)) {
    return {
      infiniteLoopDetected: true,
    };
  }

  visitedUriMap.set(uri, true);

  return {
    infiniteLoopDetected: false,
  };
};

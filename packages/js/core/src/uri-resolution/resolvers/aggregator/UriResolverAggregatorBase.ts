import { Tracer } from "@polywrap/tracing-js";
import { InfiniteLoopError } from "..";
import { Client, Result, Uri, WrapperCache } from "../../..";
import { UriPackageOrWrapper, UriResolutionResponse } from "../../core";
import {
  IUriResolutionResponse,
  IUriResolver,
  IUriResolutionStep,
  getUriResolutionPath,
} from "../../core";
import { UriResolverAggregatorOptions } from "./UriResolverAggregatorOptions";

export abstract class UriResolverAggregatorBase<TError = undefined>
  implements IUriResolver<TError | InfiniteLoopError> {
  constructor(private readonly options: UriResolverAggregatorOptions) {}

  get name(): string {
    return this.options.resolverName ?? "UriResolverAggregator";
  }

  abstract getUriResolvers(
    uri: Uri,
    client: Client,
    cache: WrapperCache
  ): Promise<Result<IUriResolver<unknown>[], TError | InfiniteLoopError>>;

  async tryResolveToWrapper(
    uri: Uri,
    client: Client,
    cache: WrapperCache
  ): Promise<IUriResolutionResponse<TError | InfiniteLoopError>> {
    const result = await this.getUriResolvers(uri, client, cache);

    if (!result.ok) {
      return UriResolutionResponse.err(result.error);
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
  ): Promise<IUriResolutionResponse<TError | InfiniteLoopError>> {
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
          return UriResolutionResponse.err(
            new InfiniteLoopError(currentUri, history),
            history
          );
        }

        const response = await resolver.tryResolveToWrapper(
          currentUri,
          client,
          cache,
          getUriResolutionPath(history)
        );

        history.push({
          resolverName: resolver.name,
          sourceUri: currentUri,
          response,
        });

        if (!response.result.ok) {
          return UriResolutionResponse.err(
            response.result.error as TError,
            history
          );
        } else if (response.result.ok) {
          const uriPackageOrWrapper: UriPackageOrWrapper =
            response.result.value;

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
            return UriResolutionResponse.ok(uriPackageOrWrapper, history);
          }
        }
      }
    }

    return UriResolutionResponse.ok(currentUri, history);
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

import { UriResolverAggregatorOptions } from ".";
import { InfiniteLoopError } from "../InfiniteLoopError";

import {
  IUriResolver,
  Uri,
  Client,
  Result,
  IUriResolutionResponse,
  UriResolutionResponse,
  IUriResolutionStep,
  UriPackageOrWrapper,
} from "@polywrap/core-js";

export abstract class UriResolverAggregatorBase<TError = undefined>
  implements IUriResolver<TError | InfiniteLoopError> {
  constructor(private readonly options: UriResolverAggregatorOptions) {}

  get name(): string {
    return this.options.resolverName ?? "UriResolverAggregator";
  }

  abstract getUriResolvers(
    uri: Uri,
    client: Client
  ): Promise<Result<IUriResolver<unknown>[], TError | InfiniteLoopError>>;

  async tryResolveUri(
    uri: Uri,
    client: Client
  ): Promise<IUriResolutionResponse<TError | InfiniteLoopError>> {
    const result = await this.getUriResolvers(uri, client);

    if (!result.ok) {
      return UriResolutionResponse.err(result.error);
    }

    const resolvers = result.value as IUriResolver[];

    return await this.tryResolveUriWithResolvers(uri, client, resolvers);
  }

  protected async tryResolveUriWithResolvers(
    uri: Uri,
    client: Client,
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

        const response = await resolver.tryResolveUri(currentUri, client);

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

import { Tracer } from "@polywrap/tracing-js";
import { InfiniteLoopError } from "..";
import { Client, Err, Ok, Result, Uri, WrapperCache } from "../../..";
import {
  UriResolutionResult,
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
  ): Promise<Result<UriResolutionResult, TError | InfiniteLoopError>> {
    const result = await this.getUriResolvers(uri, client, cache);

    if (!result.ok) {
      return Err(result.error);
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
  ): Promise<Result<UriResolutionResult, TError | InfiniteLoopError>> {
    // Keep track of past URIs to avoid infinite loops
    const visitedUriMap: Map<string, boolean> = new Map<string, boolean>();
    const history: IUriResolutionStep[] = [];

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
          return Err(new InfiniteLoopError(currentUri, history));
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

        if (!result.ok) {
          return Err(result.error as TError);
        } else if (result.ok) {
          if (result.value.uri()) {
            const resultUri = result.value.uri() as Uri;

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
            return Ok(result.value);
          }
        }
      }
    }

    return Ok(new UriResolutionResult(currentUri));
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

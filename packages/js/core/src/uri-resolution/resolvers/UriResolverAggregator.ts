import { Tracer } from "@polywrap/tracing-js";
import {
  UriResolutionResult,
  IUriResolver,
  UriResolver,
  IUriResolutionStep,
  InfiniteLoopError,
  getUriResolutionPath,
  UriResolverError,
  IUriResolutionError,
} from "../core";
import { Uri, Client, WrapperCache, Wrapper } from "../..";

export type UriResolverAggregatorResult = UriResolutionResult<UriResolverAggregatorError>;

export type UriResolverAggregatorError =
  | InfiniteLoopError
  | IUriResolutionError;
export abstract class UriResolverAggregator
  implements UriResolver<UriResolverAggregatorError> {
  constructor(private readonly options: { fullResolution: boolean }) {}

  abstract get name(): string;

  abstract getUriResolvers(
    uri: Uri,
    client: Client,
    cache: WrapperCache
  ): Promise<IUriResolver[] | IUriResolutionError>;

  async tryResolveToWrapper(
    uri: Uri,
    client: Client,
    cache: WrapperCache
  ): Promise<UriResolverAggregatorResult> {
    const result = await this.getUriResolvers(uri, client, cache);
    const error = result as IUriResolutionError;

    if (error.type) {
      return {
        uri,
        error,
      };
    }

    const resolvers = result as IUriResolver[];

    // Keep track of past URIs to avoid infinite loops
    const visitedUriMap: Map<string, boolean> = new Map<string, boolean>();
    const history: IUriResolutionStep[] = [];

    let currentUri: Uri = uri;
    let wrapper: Wrapper | undefined;

    let runAgain = true;

    while (runAgain) {
      runAgain = false;

      const { infiniteLoopDetected } = trackVisitedUri(
        currentUri.uri,
        visitedUriMap
      );

      for (const resolver of resolvers) {
        if (infiniteLoopDetected) {
          return {
            uri: currentUri,
            wrapper,
            history,
            error: new InfiniteLoopError(),
          };
        }

        const result = await resolver.tryResolveToWrapper(
          currentUri,
          client,
          cache,
          getUriResolutionPath(history)
        );

        history.push({
          uriResolver: resolver.name,
          sourceUri: currentUri,
          result,
        });

        if (result.wrapper) {
          wrapper = result.wrapper;

          Tracer.addEvent("uri-resolver-redirect", {
            from: currentUri.uri,
            to: "wrapper",
          });

          break;
        } else if (result.uri && result.uri.uri !== currentUri.uri) {
          Tracer.addEvent("uri-resolver-redirect", {
            from: currentUri.uri,
            to: result.uri.uri,
          });

          currentUri = result.uri;

          if (this.options.fullResolution) {
            runAgain = true;
          }
          break;
        } else if (result.error) {
          return {
            uri: currentUri,
            history,
            error: new UriResolverError(resolver.name, result.error),
          };
        }
      }
    }

    return {
      uri: currentUri,
      wrapper,
      history,
    };
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

import { Tracer } from "@polywrap/tracing-js";
import {
  UriResolver,
  UriResolutionResult,
  Uri,
  Client,
  WrapperCache,
  IUriResolver,
  IUriResolutionStep,
  Wrapper,
  getUriResolutionPath,
} from "../../..";
import { InfiniteLoopError } from "..";

export abstract class UriResolverAggregatorBase<TError = undefined>
  implements UriResolver<UriResolutionResult<TError | InfiniteLoopError>> {
  constructor(private readonly options: { fullResolution: boolean }) {}

  abstract get name(): string;

  abstract getUriResolvers(
    uri: Uri,
    client: Client,
    cache: WrapperCache
  ): Promise<{
    resolvers?: IUriResolver[];
    error?: TError;
  }>;

  async tryResolveToWrapper(
    uri: Uri,
    client: Client,
    cache: WrapperCache
  ): Promise<UriResolutionResult<TError | InfiniteLoopError>> {
    const result = await this.getUriResolvers(uri, client, cache);

    if (result.error) {
      return {
        uri,
        error: result.error,
      };
    }

    const resolvers = result.resolvers as IUriResolver[];

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
    resolvers: IUriResolver[]
  ): Promise<UriResolutionResult<TError | InfiniteLoopError>> {
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
            error: new InfiniteLoopError(currentUri, history),
          };
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
            error: result.error as TError,
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

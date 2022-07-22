import { Wrapper, WrapperCache, Client, Uri } from "../../types";
import {
  UriResolver,
  UriResolutionResult,
  UriResolutionStep,
  InfiniteLoopError,
  UriResolverError,
  getUriResolutionPath,
} from ".";

import { Tracer } from "@polywrap/tracing-js";
import { ResolveUriResult } from "./types";

export const tryResolveToWrapper = async (
  uri: Uri,
  uriResolvers: readonly UriResolver<unknown>[],
  client: Client,
  cache: WrapperCache
): Promise<UriResolutionResult> => {
  // Keep track of past URIs to avoid infinite loops
  const visitedUriMap: Map<string, boolean> = new Map<string, boolean>();
  const history: UriResolutionStep[] = [];

  let currentUri: Uri = uri;
  let wrapper: Wrapper | undefined;

  let runAgain = true;

  while (runAgain) {
    runAgain = false;

    const { infiniteLoopDetected } = trackVisitedUri(
      currentUri.uri,
      visitedUriMap
    );

    for (const resolver of uriResolvers) {
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

      trackUriHistory(currentUri, resolver, result, history);

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
        runAgain = true;
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
};

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

const trackUriHistory = (
  sourceUri: Uri,
  resolver: UriResolver<unknown>,
  result: ResolveUriResult<unknown>,
  history: UriResolutionStep[]
) => {
  history.push({
    uriResolver: resolver.name,
    sourceUri,
    result: {
      ...result,
      wrapper: !!result.wrapper,
    },
  });
};

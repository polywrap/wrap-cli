import { Wrapper, WrapperCache, Client, Uri } from "../../types";
import { UriResolutionHistory } from "./types/UriResolutionHistory";
import { UriResolutionStack } from "./types/UriResolutionStack";
import { UriResolutionResult } from "./types/UriResolutionResult";
import { UriResolver } from "./types/UriResolver";
import { ResolveUriErrorType, ResolveUriResult } from "./types";
import { InternalResolverError } from "./types/InternalResolverError";

import { Tracer } from "@polywrap/tracing-js";

export const resolveUri = async (
  uri: Uri,
  uriResolvers: readonly UriResolver[],
  client: Client,
  cache: WrapperCache
): Promise<ResolveUriResult> => {
  // Keep track of past URIs to avoid infinite loops
  const visitedUriMap: Map<string, boolean> = new Map<string, boolean>();
  const uriResolutionStack: UriResolutionStack = [];

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
          uriHistory: new UriResolutionHistory(uriResolutionStack),
          error: {
            type: ResolveUriErrorType.InfiniteLoop,
          },
        };
      }

      const result = await resolver.resolveUri(
        currentUri,
        client,
        cache,
        new UriResolutionHistory(uriResolutionStack).getResolutionPath().stack
      );

      trackUriHistory(currentUri, resolver, result, uriResolutionStack);

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
          uriHistory: new UriResolutionHistory(uriResolutionStack),
          error: new InternalResolverError(resolver.name, result.error),
        };
      }
    }
  }

  return {
    uri: currentUri,
    wrapper,
    uriHistory: new UriResolutionHistory(uriResolutionStack),
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
  resolver: UriResolver,
  result: UriResolutionResult,
  uriResolutionStack: UriResolutionStack
) => {
  uriResolutionStack.push({
    uriResolver: resolver.name,
    sourceUri,
    result: {
      ...result,
      wrapper: !!result.wrapper,
    },
  });
};

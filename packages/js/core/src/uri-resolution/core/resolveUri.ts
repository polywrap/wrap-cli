import { Api, ApiCache, Client, Uri } from "../../types";
import { ResolveUriError } from "./types/ResolveUriError";
import { UriResolutionHistory } from "./types/UriResolutionHistory";
import { UriResolutionStack } from "./types/UriResolutionStack";
import { UriResolutionResult } from "./types/UriResolutionResult";
import { UriToApiResolver } from "./types/UriToApiResolver";

import { Tracer } from "@web3api/tracing-js";

export const resolveUri = async (
  uri: Uri,
  resolvers: readonly UriToApiResolver[],
  client: Client,
  cache: ApiCache
): Promise<{
  uri?: Uri;
  api?: Api;
  uriHistory: UriResolutionHistory;
  error?: ResolveUriError;
}> => {
  // Keep track of past URIs to avoid infinite loops
  const visitedUriMap: Map<string, boolean> = new Map<string, boolean>();
  const uriResolutionStack: UriResolutionStack = [];

  let currentUri: Uri = uri;
  let api: Api | undefined;

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
          api,
          uriHistory: new UriResolutionHistory(uriResolutionStack),
          error: infiniteLoopDetected
            ? ResolveUriError.InfiniteLoop
            : undefined,
        };
      }

      const result = await resolver.resolveUri(
        currentUri,
        client,
        cache,
        new UriResolutionHistory(uriResolutionStack).getResolutionPath().stack
      );

      trackUriHistory(currentUri, resolver, result, uriResolutionStack);

      if (result.api) {
        api = result.api;

        Tracer.addEvent("uri-resolver-redirect", {
          from: currentUri.uri,
          to: "api",
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
      }
    }
  }

  return {
    uri: currentUri,
    api,
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
  resolver: UriToApiResolver,
  result: UriResolutionResult,
  uriResolutionStack: UriResolutionStack
) => {
  uriResolutionStack.push({
    resolver: resolver.name,
    sourceUri,
    result: {
      ...result,
      api: !!result.api,
    },
  });
};

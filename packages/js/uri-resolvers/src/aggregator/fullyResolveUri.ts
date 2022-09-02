import { InfiniteLoopError } from "../InfiniteLoopError";

import {
  Uri,
  IUriResolutionResponse,
  UriResolutionResponse,
  IUriResolutionStep,
} from "@polywrap/core-js";

export const fullyResolveUri = async <TError>(
  uri: Uri,
  resolveUri: (
    currentUri: Uri,
    history: IUriResolutionStep<unknown>[]
  ) => Promise<IUriResolutionResponse<TError>>
): Promise<IUriResolutionResponse<TError | InfiniteLoopError>> => {
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

    if (infiniteLoopDetected) {
      return UriResolutionResponse.err(
        new InfiniteLoopError(currentUri, history),
        history
      );
    }

    const response = await resolveUri(currentUri, history);

    if (response.result.ok && response.result.value.type === "uri") {
      const resultUri = response.result.value.uri;

      if (resultUri.uri === currentUri.uri) {
        continue;
      }

      currentUri = resultUri;

      runAgain = true;
    } else {
      return response;
    }
  }

  return UriResolutionResponse.ok(currentUri, history);
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

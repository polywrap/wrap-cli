import { Uri, UriRedirect } from "../types";

import { Tracer } from "@polywrap/tracing-js";

export const applyRedirects = Tracer.traceFunc(
  "core: applyRedirects",
  (uri: Uri, redirects: readonly UriRedirect<Uri>[]): Uri => {
    // Keep track of past redirects (from -> to) to find the final uri
    const redirectFromToMap: Record<string, Uri> = {};

    const throwError = (message: string) => {
      throw Error(
        `${message}\nResolution Stack: ${JSON.stringify(
          redirectFromToMap,
          null,
          2
        )}`
      );
    };

    for (const redirect of redirects) {
      if (!redirect.from) {
        throwError(
          `Redirect missing the from property.\nEncountered while resolving ${uri.uri}`
        );
      }

      if (redirectFromToMap[redirect.from.uri]) {
        continue;
      }

      redirectFromToMap[redirect.from.uri] = redirect.to;
    }

    let finalUri = uri;

    const visitedUris: Record<string, boolean> = {};

    while (redirectFromToMap[finalUri.uri]) {
      visitedUris[finalUri.uri] = true;

      finalUri = redirectFromToMap[finalUri.uri];

      if (visitedUris[finalUri.uri]) {
        throwError(`Infinite loop while resolving URI "${uri}".`);
      }
    }

    return finalUri;
  }
);

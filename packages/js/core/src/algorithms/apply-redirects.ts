import { Uri, IUriRedirect } from "../types";

import { Tracer } from "@polywrap/tracing-js";
import { Result, ResultErr, ResultOk } from "@polywrap/result";

export const applyRedirects = Tracer.traceFunc(
  "core: applyRedirects",
  (uri: Uri, redirects: readonly IUriRedirect<Uri>[]): Result<Uri, Error> => {
    // Keep track of past redirects (from -> to) to find the final uri
    const redirectFromToMap: Record<string, Uri> = {};

    const createError = (message: string) => {
      const error = Error(
        `${message}\nResolution Stack: ${JSON.stringify(
          redirectFromToMap,
          null,
          2
        )}`
      );
      return ResultErr(error);
    };

    for (const redirect of redirects) {
      if (!redirect.from) {
        return createError(
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
        return createError(`Infinite loop while resolving URI "${uri}".`);
      }
    }

    return ResultOk(finalUri);
  }
);

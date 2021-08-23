import { Uri, UriPathNode, UriRedirect } from "../types";

import { Tracer } from "@web3api/tracing-js";

export const applyRedirects = Tracer.traceFunc(
  "core: applyRedirects",
  (uri: Uri, redirects: readonly UriRedirect<Uri>[]): Uri => {
    const { finalUri } = useRedirects(uri, redirects);
    return finalUri;
  }
);

export const followRedirects = Tracer.traceFunc(
  "core: followRedirects",
  (uri: Uri, redirects: readonly UriRedirect<Uri>[]): UriPathNode[] => {
    const { finalUri, visitedUris } = useRedirects(uri, redirects);

    // add uri path in order visited
    const path: UriPathNode[] = [];
    for (const uri of visitedUris.keys()) {
      path.push({ uri: new Uri(uri), fromRedirect: true, isPlugin: false });
    }
    path.push({ uri: finalUri, fromRedirect: true });
    // correct first uri fromRedirect value
    path[0].fromRedirect = false;

    return path;
  }
);

const useRedirects = (
  uri: Uri,
  redirects: readonly UriRedirect<Uri>[]
): { finalUri: Uri; visitedUris: Map<string, boolean> } => {
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

  const visitedUris: Map<string, boolean> = new Map();

  while (redirectFromToMap[finalUri.uri]) {
    visitedUris.set(finalUri.uri, true);

    finalUri = redirectFromToMap[finalUri.uri];

    if (visitedUris.get(finalUri.uri)) {
      throwError(`Infinite loop while resolving URI "${uri}".`);
    }
  }

  return { finalUri, visitedUris };
};

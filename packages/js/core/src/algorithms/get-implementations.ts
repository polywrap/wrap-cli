import { Uri, UriRedirect } from "../types";

import { Tracer } from "@web3api/tracing";

export const getImplementations = Tracer.traceFunc(
  "core: getImplementations", (
    abstractApi: Uri,
    redirects: readonly UriRedirect<Uri>[]
  ): Uri[] => {
    const result: Uri[] = [];

    const addUniqueResult = (uri: Uri) => {
      // If the URI hasn't been added already
      if (result.findIndex((i) => Uri.equals(i, uri)) === -1) {
        result.push(uri);
      }
    };

    for (const redirect of redirects) {
      // Plugin implemented check
      if (!Uri.isUri(redirect.to)) {
        const { implemented } = redirect.to.manifest;
        const implementedApi =
          implemented.findIndex((uri) => Uri.equals(uri, abstractApi)) > -1;

        if (implementedApi) {
          addUniqueResult(redirect.from);
        }
      }
      // Explicit check
      else if (Uri.isUri(redirect.from)) {
        if (Uri.equals(redirect.from, abstractApi)) {
          addUniqueResult(redirect.to);
        }
      }
    }

    return result;
  }
);

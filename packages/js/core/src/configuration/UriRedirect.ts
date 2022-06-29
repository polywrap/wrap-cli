import { Uri } from "..";

import { Tracer } from "@polywrap/tracing-js";

export interface UriRedirect<TUri = string> {
  from: TUri;
  to: TUri;
}

export const sanitizeUriRedirects = Tracer.traceFunc(
  "core: sanitizeUriRedirects",
  (input: UriRedirect<string>[]): UriRedirect<Uri>[] => {
    const output: UriRedirect<Uri>[] = [];
    for (const definition of input) {
      const from = new Uri(definition.from);
      const to =
        typeof definition.to === "string"
          ? new Uri(definition.to)
          : definition.to;

      output.push({
        from: from,
        to: to,
      });
    }

    return output;
  }
);

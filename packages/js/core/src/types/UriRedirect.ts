import { Uri } from ".";

import { Tracer } from "@polywrap/tracing-js";

export interface UriRedirect<TUri = string> {
  from: TUri;
  to: TUri;
}

export const sanitizeUriRedirects = Tracer.traceFunc(
  "core: sanitizeUriRedirects",
  (input: UriRedirect<Uri | string>[]): UriRedirect<Uri>[] => {
    const output: UriRedirect<Uri>[] = [];
    for (const definition of input) {
      output.push({
        from: Uri.from(definition.from),
        to: Uri.from(definition.to),
      });
    }

    return output;
  }
);

import { Uri } from ".";

import { Tracer } from "@polywrap/tracing-js";
import { toUri } from "../utils";

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
        from: toUri(definition.from),
        to: toUri(definition.to),
      });
    }

    return output;
  }
);

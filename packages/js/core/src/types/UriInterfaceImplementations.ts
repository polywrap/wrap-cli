import { Uri } from ".";

import { Tracer } from "@web3api/tracing-js";

export interface UriInterfaceImplementations<TUri = string> {
  interface: TUri;
  implementations: TUri[];
}

export const sanitizeUriInterfaceImplementations = Tracer.traceFunc(
  "core: sanitizeUriInterfaceImplementations",
  (
    input: UriInterfaceImplementations<string>[]
  ): UriInterfaceImplementations<Uri>[] => {
    const output: UriInterfaceImplementations<Uri>[] = [];
    for (const definition of input) {
      const interfaceUri = new Uri(definition.interface);

      const implementations = definition.implementations.map((x) =>
        typeof x === "string" ? new Uri(x) : x
      );

      output.push({
        interface: interfaceUri,
        implementations: implementations,
      });
    }

    return output;
  }
);

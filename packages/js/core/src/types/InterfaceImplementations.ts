import { Uri } from ".";

import { Tracer } from "@polywrap/tracing-js";

export interface InterfaceImplementations<TUri = string> {
  interface: TUri;
  implementations: TUri[];
}

export const sanitizeInterfaceImplementations = Tracer.traceFunc(
  "core: sanitizeInterfaceImplementations",
  (
    input: InterfaceImplementations<string>[]
  ): InterfaceImplementations<Uri>[] => {
    const output: InterfaceImplementations<Uri>[] = [];
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

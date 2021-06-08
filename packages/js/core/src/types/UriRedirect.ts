import { PluginPackage, Uri } from ".";

import { Tracer } from "@web3api/tracing-js";

export interface UriRedirect<TUri = string> {
  /** Redirect from this URI */
  from: TUri;

  /** The destination URI, or plugin, that will now handle the invocation. */
  // TODO: currently UriRedirects are used for: plugins, implementations, and redirects. This is either elegant, or confusing...
  //       Should look at what it looks like to seperate these.
  to: TUri | PluginPackage;
}

export interface UriInterfaceImplementations<TUri = string> {
  interface: TUri;
  implementations: TUri[];
}

export const sanitizeUriRedirects = Tracer.traceFunc(
  "core: sanitizeUriRedirects",
  (input: UriRedirect[]): UriRedirect<Uri>[] => {
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

export const sanitizeUriInterfaceImplementations = Tracer.traceFunc(
  "core: sanitizeUriInterfaceImplementations",
  (input: UriInterfaceImplementations[]): UriInterfaceImplementations<Uri>[] => {
    const output: UriInterfaceImplementations<Uri>[] = [];
    for (const definition of input) {
      const interfaceUri = new Uri(definition.interface);

      const implementations = definition.implementations
        .map(x => 
            typeof x === "string"
              ? new Uri(x)
              : x
          );

      output.push({
        interface: interfaceUri,
        implementations: implementations,
      });
    }

    return output;
  }
);

import {
  Env,
  InterfaceImplementations,
  PluginRegistration,
  Uri,
  UriRedirect,
} from "@polywrap/core-js";
import { Tracer } from "@polywrap/tracing-js";
import { toUri } from "./toUri";

export const sanitizeEnvs = Tracer.traceFunc(
  "clientConfig: sanitizeEnvs",
  (environments: Env<Uri | string>[]): Env<Uri>[] => {
    const output: Env<Uri>[] = [];

    for (const env of environments) {
      output.push({
        ...env,
        uri: toUri(env.uri),
      });
    }

    return output;
  }
);

export const sanitizeInterfaceImplementations = Tracer.traceFunc(
  "clientConfig: sanitizeInterfaceImplementations",
  (
    input: InterfaceImplementations<Uri | string>[]
  ): InterfaceImplementations<Uri>[] => {
    const output: InterfaceImplementations<Uri>[] = [];
    for (const definition of input) {
      const interfaceUri = toUri(definition.interface);

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

export const sanitizePluginRegistrations = Tracer.traceFunc(
  "clientConfig: sanitizePluginRegistrations",
  (input: PluginRegistration<Uri | string>[]): PluginRegistration<Uri>[] => {
    const output: PluginRegistration<Uri>[] = [];
    for (const definition of input) {
      const uri = toUri(definition.uri);

      output.push({
        uri,
        plugin: definition.plugin,
      });
    }

    return output;
  }
);

export const sanitizeUriRedirects = Tracer.traceFunc(
  "clientConfig: sanitizeUriRedirects",
  (input: UriRedirect<Uri | string>[]): UriRedirect<Uri>[] => {
    const output: UriRedirect<Uri>[] = [];
    for (const definition of input) {
      const from = toUri(definition.from);
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

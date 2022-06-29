import { PluginFactory, Uri } from ".";

import { Tracer } from "@polywrap/tracing-js";

export interface PluginRegistration<TUri = string, TConfig = unknown> {
  uri: TUri;
  plugin: PluginFactory<TConfig>;
}

export const sanitizePluginRegistrations = Tracer.traceFunc(
  "core: sanitizePluginRegistrations",
  (input: PluginRegistration[]): PluginRegistration<Uri>[] => {
    const output: PluginRegistration<Uri>[] = [];
    for (const definition of input) {
      const uri = new Uri(definition.uri);

      output.push({
        uri,
        plugin: definition.plugin,
      });
    }

    return output;
  }
);

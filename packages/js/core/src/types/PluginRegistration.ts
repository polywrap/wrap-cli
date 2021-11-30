import { PluginPackage, Uri } from ".";

import { Tracer } from "@web3api/tracing-js";

export interface PluginRegistration<TUri = string> {
  uri: TUri;
  plugin: PluginPackage;
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

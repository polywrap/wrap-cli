/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */

import { PolywrapClient, PolywrapClientConfig } from "./PolywrapClient";
import { PluginConfigs, modules, uris } from "./pluginConfigs";

import { PluginRegistration } from "@polywrap/core-js";
import { Tracer } from "@polywrap/tracing-js";
import { ClientConfigBuilder } from "@polywrap/client-config-builder-js";

export { PluginConfigs };

export const createPolywrapClient = Tracer.traceFunc(
  "createPolywrapClient",
  async (
    pluginConfigs: PluginConfigs,
    config?: Partial<PolywrapClientConfig>
  ): Promise<PolywrapClient> => {
    const plugins: PluginRegistration[] = [];

    for (const plugin of Object.keys(pluginConfigs)) {
      let pluginModule: any;

      if (!modules[plugin]) {
        throw Error(
          `Requested plugin "${plugin}" is not a supported createPolywrapClient plugin.`
        );
      }

      try {
        pluginModule = await import(modules[plugin]);
      } catch (err) {
        throw Error(
          `Failed to import plugin module. Please install the package "${modules[plugin]}".\n` +
            `Error: ${err.message}`
        );
      }

      const pluginFactory = pluginModule["plugin"];

      if (!pluginFactory) {
        throw Error(
          `Plugin module "${modules[plugin]}" is missing the "plugin: PluginFactory" export.`
        );
      }

      if (typeof pluginFactory !== "function") {
        throw Error(
          `The "plugin: PluginFactory" export must be a function. Found in module "${modules[plugin]}".`
        );
      }

      const pluginPackage = pluginFactory(
        (pluginConfigs as Record<string, unknown>)[plugin]
      );
      if (
        !pluginPackage ||
        typeof pluginPackage !== "object" ||
        !pluginPackage.factory ||
        !pluginPackage.manifest
      ) {
        throw Error(
          `Plugin package is malformed. Expected object with keys "factory" and "manifest". Got: ${pluginPackage}`
        );
      }

      plugins.push({
        uri: uris[plugin],
        plugin: pluginPackage,
      });
    }

    if (config) {
      const builder = new ClientConfigBuilder().add(config);

      for (const plugin of plugins) {
        builder.addPlugin(plugin.uri, plugin.plugin);
      }

      const sanitizedConfig = builder.build();

      return new PolywrapClient(sanitizedConfig);
    } else {
      return new PolywrapClient({ plugins });
    }
  }
);

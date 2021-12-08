/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */

import { Web3ApiClient, Web3ApiClientConfig } from "./Web3ApiClient";
import { PluginConfigs, modules, uris } from "./pluginConfigs";

import { PluginRegistration } from "@web3api/core-js";
import { Tracer } from "@web3api/tracing-js";

export { PluginConfigs };

export const createWeb3ApiClient = Tracer.traceFunc(
  "createWeb3ApiClient",
  async (
    pluginConfigs: PluginConfigs,
    config?: Partial<Web3ApiClientConfig>
  ): Promise<Web3ApiClient> => {
    const plugins: PluginRegistration[] = [];

    for (const plugin of Object.keys(pluginConfigs)) {
      let pluginModule: any;

      if (!modules[plugin]) {
        throw Error(
          `Requested plugin "${plugin}" is not a supported createWeb3ApiClient plugin.`
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
      return new Web3ApiClient({
        ...config,
        plugins: [...plugins, ...(config.plugins ? config.plugins : [])],
      });
    } else {
      return new Web3ApiClient({ plugins });
    }
  }
);

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */

import { Web3ApiClient } from "./Web3ApiClient";
import { PluginConfigs, modules, uris } from "./pluginConfigs";

import { UriRedirect } from "@web3api/core-js";

export { PluginConfigs };

export async function createWeb3ApiClient(
  plugins: PluginConfigs,
  traceEnabled: boolean = false
): Promise<Web3ApiClient> {
  const redirects: UriRedirect[] = [];

  for (const plugin of Object.keys(plugins)) {
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
      (plugins as Record<string, unknown>)[plugin]
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

    redirects.push({
      from: uris[plugin],
      to: pluginPackage,
    });
  }

  return new Web3ApiClient({ redirects }, traceEnabled);
}

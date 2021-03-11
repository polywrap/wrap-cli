import { Web3ApiClient } from "./Web3ApiClient";

import { UriRedirect, Uri } from "@web3api/core-js";

export type ModuleConnector = Record<string, string>;
export type Web3ApiClientParams = Record<string, ModuleConnector>;

export type RecordRedirect = {
  value: {
    to: string;
    from: string;
  };
};

export const createWeb3ApiClient = async (services: Web3ApiClientParams) => {
  const plugins = Object.keys(services);

  const getPluginModule = async (plugin: string): Promise<UriRedirect> => {
    //do dynamic import and throw error if plugin it's not installed
    try {
      const Module = await import(`@web3api/${plugin}-plugin-js`);
      const pluginMethodName = Object.keys(Module)[0];
      const CurrentPlugin = Module[pluginMethodName];
      const { from, ...moduleConnectors } = services[plugin];
      return {
        from: new Uri(from),
        to: {
          factory: () => new CurrentPlugin(moduleConnectors),
          manifest: CurrentPlugin.manifest(),
        },
      };
    } catch (e) {
      throw new Error(e.message);
    }
  };

  const pluginPromises = plugins.map(async (plugin: string) => {
    const redirect = await getPluginModule(plugin);
    return redirect;
  });

  const pluginsLoaded = await Promise.all(pluginPromises);

  return new Web3ApiClient({ redirects: pluginsLoaded });
};

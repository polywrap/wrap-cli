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
  try {
    const getPluginModule = async (plugin: string): Promise<UriRedirect> => {
      const Module = await import(`@web3api/${plugin}-plugin-js`);
      //@TODO: Make sure this is the correct way
      const pluginMethodName = Object.keys(Module)[0];
      const CurrentPlugin = Module[pluginMethodName];
      const { from, ...pluginConfig } = services[plugin];
      return {
        from: new Uri(from),
        to: {
          factory: () => new CurrentPlugin(pluginConfig),
          manifest: CurrentPlugin.manifest(),
        },
      };
    };

    const pluginPromises = plugins.map(async (plugin: string) => {
      const redirect = await getPluginModule(plugin);
      return redirect;
    });

    const pluginsLoaded = await Promise.all(pluginPromises);

    return new Web3ApiClient({ redirects: pluginsLoaded });
  } catch (e) {
    if (e.code === "MODULE_NOT_FOUND") {
      throw new Error(
        `You must install ${e.moduleName} into your project in order to use it`
      );
    }

    throw new Error(e.message);
  }
};

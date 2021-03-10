import { Web3ApiClient } from "./Web3ApiClient";
import { UriRedirect, Uri } from "@web3api/core-js";
import { EthereumPlugin } from "@web3api/ethereum-plugin-js";
import { IpfsPlugin } from "@web3api/ipfs-plugin-js";
import { EnsPlugin } from "@web3api/ens-plugin-js";

export type ModuleConnector = Record<string, string>;
export type Web3ApiClientParams = Record<string, ModuleConnector>;

export type RecordRedirect = {
  value: {
    to: string;
    from: string;
  };
};

export const createWeb3ApiClient = async (
  services: Web3ApiClientParams,
  { ipfsProvider, ethereumProvider, ensAddress }: any
) => {
  const plugins = Object.keys(services);

  const getPluginModule = async (plugin: string): Promise<UriRedirect> => {
    //do dynamic import and throw error if plugin it's not installed
    try {
      const Module = await import(`@web3api/${plugin}-plugin-js`);
      const pluginMethodName = Object.keys(Module)[0];
      const { from, ...moduleConnectors } = services[plugin];
      const uri = new Uri(from);
      return {
        from: uri,
        to: {
          factory: () => new Module(moduleConnectors),
          manifest: Module[pluginMethodName].manifest(),
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

  const mockRedirects = [
    {
      from: new Uri("w3://ens/ethereum.web3api.eth"),
      to: {
        factory: () => new EthereumPlugin({ provider: ethereumProvider }),
        manifest: EthereumPlugin.manifest(),
      },
    },
    {
      from: new Uri("w3://ens/ipfs.web3api.eth"),
      to: {
        factory: () => new IpfsPlugin({ provider: ipfsProvider }),
        manifest: IpfsPlugin.manifest(),
      },
    },
    {
      from: new Uri("w3://ens/ens.web3api.eth"),
      to: {
        factory: () => new EnsPlugin({ address: ensAddress }),
        manifest: EnsPlugin.manifest(),
      },
    },
  ];

  console.log(
    "///////////////////////////  PLUGINS LOADED  REDIRECTS  //////////////////////////////////////"
  );
  console.log(pluginsLoaded);

  console.log(
    "///////////////////////////  MOCK  REDIRECTS  //////////////////////////////////////"
  );
  console.log(mockRedirects);

  return new Web3ApiClient({ redirects: pluginsLoaded });
};

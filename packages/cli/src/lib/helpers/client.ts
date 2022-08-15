import { PluginRegistration } from "@polywrap/core-js";
import { ensResolverPlugin } from "@polywrap/ens-resolver-plugin-js";
import {
  ethereumPlugin,
  Connection,
  Connections,
} from "@polywrap/ethereum-plugin-js";
import { ipfsPlugin } from "@polywrap/ipfs-plugin-js";
import { PolywrapClient, defaultIpfsProviders } from "@polywrap/client-js";

interface SimpleClientConfig {
  ensAddress?: string;
  ethProvider?: string;
  ipfsProvider?: string;
}

export function getSimpleClient(config: SimpleClientConfig): PolywrapClient {
  const { ensAddress, ethProvider, ipfsProvider } = config;
  const plugins: PluginRegistration[] = [];
  if (ensAddress) {
    plugins.push({
      uri: "wrap://ens/ens-resolver.polywrap.eth",
      plugin: ensResolverPlugin({
        addresses: {
          testnet: ensAddress,
        },
      }),
    });
  }
  if (ethProvider) {
    plugins.push({
      uri: "wrap://ens/ethereum.polywrap.eth",
      plugin: ethereumPlugin({
        connections: new Connections({
          networks: {
            testnet: new Connection({
              provider: ethProvider,
            }),
          },
        }),
      }),
    });
  }
  if (ipfsProvider) {
    plugins.push({
      uri: "wrap://ens/ipfs.polywrap.eth",
      plugin: ipfsPlugin({
        provider: ipfsProvider,
        fallbackProviders: defaultIpfsProviders,
      }),
    });
  }
  return new PolywrapClient({ plugins });
}

import { PluginRegistration, Env } from "@polywrap/core-js";
import { ensResolverPlugin } from "@polywrap/ens-resolver-plugin-js";
import {
  ethereumPlugin,
  Connection,
  Connections,
} from "@polywrap/ethereum-plugin-js";
import { ipfsPlugin } from "@polywrap/ipfs-plugin-js";
import { PolywrapClient } from "@polywrap/client-js";
import {
  ClientConfigBuilder,
  defaultIpfsProviders,
} from "@polywrap/client-config-builder-js";

interface SimpleClientConfig {
  ensAddress?: string;
  ethProvider?: string;
  ipfsProvider?: string;
}

export function getSimpleClient(config: SimpleClientConfig): PolywrapClient {
  const { ensAddress, ethProvider, ipfsProvider } = config;
  const plugins: PluginRegistration[] = [];
  const envs: Env[] = [];

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
      plugin: ipfsPlugin({}),
    });

    envs.push({
      uri: "wrap://ens/ipfs.polywrap.eth",
      env: {
        provider: ipfsProvider,
        fallbackProviders: defaultIpfsProviders,
      },
    });
  }

  const builder = new ClientConfigBuilder();

  for (const plugin of plugins) {
    builder.addPlugin(plugin.uri, plugin.plugin);
  }

  return new PolywrapClient(builder.buildPartial());
}

import { Client, Env, IUriPackage, Uri } from "@polywrap/core-js";
import { ensResolverPlugin } from "@polywrap/ens-resolver-plugin-js";
import {
  ethereumPlugin,
  Connection,
  Connections,
} from "@polywrap/ethereum-plugin-js";
import { ipfsPlugin } from "@polywrap/ipfs-plugin-js";
import { defaultIpfsProviders } from "@polywrap/client-config-builder-js";
import { PolywrapClient } from "@polywrap/client-js";

interface SimpleClientConfig {
  ensAddress?: string;
  ethProvider?: string;
  ipfsProvider?: string;
}

export function getSimpleClient(config: SimpleClientConfig): Client {
  const { ensAddress, ethProvider, ipfsProvider } = config;
  const plugins: IUriPackage<Uri | string>[] = [];
  const envs: Env[] = [];

  if (ensAddress) {
    plugins.push({
      uri: "wrap://ens/ens-resolver.polywrap.eth",
      package: ensResolverPlugin({
        addresses: {
          testnet: ensAddress,
        },
      }),
    });
  }
  if (ethProvider) {
    plugins.push({
      uri: "wrap://ens/ethereum.polywrap.eth",
      package: ethereumPlugin({
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
      package: ipfsPlugin({}),
    });

    envs.push({
      uri: "wrap://ens/ipfs.polywrap.eth",
      env: {
        provider: ipfsProvider,
        fallbackProviders: defaultIpfsProviders,
      },
    });
  }

  return new PolywrapClient({ envs, packages: plugins });
}

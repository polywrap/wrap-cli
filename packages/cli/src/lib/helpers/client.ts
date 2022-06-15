import { PluginRegistration } from "@polywrap/core-js";
import { ensPlugin } from "@polywrap/ens-plugin-js";
import { ethereumPlugin } from "@polywrap/ethereum-plugin-js";
import { ipfsPlugin } from "@polywrap/ipfs-plugin-js";
import { Web3ApiClient, defaultIpfsProviders } from "@polywrap/client-js";

interface SimpleClientConfig {
  ensAddress?: string;
  ethProvider?: string;
  ipfsProvider?: string;
}

export function getSimpleClient(config: SimpleClientConfig): Web3ApiClient {
  const { ensAddress, ethProvider, ipfsProvider } = config;
  const plugins: PluginRegistration[] = [];
  if (ensAddress) {
    plugins.push({
      uri: "w3://ens/ens.web3api.eth",
      plugin: ensPlugin({
        addresses: {
          testnet: ensAddress,
        },
      }),
    });
  }
  if (ethProvider) {
    plugins.push({
      uri: "w3://ens/ethereum.web3api.eth",
      plugin: ethereumPlugin({
        networks: {
          testnet: {
            provider: ethProvider,
          },
        },
      }),
    });
  }
  if (ipfsProvider) {
    plugins.push({
      uri: "w3://ens/ipfs.web3api.eth",
      plugin: ipfsPlugin({
        provider: ipfsProvider,
        fallbackProviders: defaultIpfsProviders,
      }),
    });
  }
  return new Web3ApiClient({ plugins });
}

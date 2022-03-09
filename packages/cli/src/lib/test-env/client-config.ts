import { getTestEnvProviders } from "./providers";

import {
  PluginRegistration,
  Web3ApiClientConfig,
  defaultIpfsProviders,
} from "@web3api/client-js";
import { ensPlugin } from "@web3api/ens-plugin-js";
import { ethereumPlugin } from "@web3api/ethereum-plugin-js";
import { ipfsPlugin } from "@web3api/ipfs-plugin-js";
import axios from "axios";

export async function getTestEnvClientConfig(): Promise<
  Partial<Web3ApiClientConfig>
> {
  const providers = await getTestEnvProviders();
  const ipfsProvider = providers.ipfsProvider;
  const ethProvider = providers.ethProvider;

  if (!ipfsProvider || !ethProvider) {
    throw Error("Test environment not found.");
  }

  const {
    data: { ensAddress },
  } = await axios.get("http://localhost:4040/ens");

  // TODO: move this into its own package, since it's being used everywhere?
  // maybe have it exported from test-env.
  const plugins: PluginRegistration[] = [
    {
      uri: "w3://ens/ethereum.web3api.eth",
      plugin: ethereumPlugin({
        networks: {
          testnet: {
            provider: ethProvider,
          },
          mainnet: {
            provider:
              "https://mainnet.infura.io/v3/b00b2c2cc09c487685e9fb061256d6a6",
          },
        },
      }),
    },
    {
      uri: "w3://ens/ipfs.web3api.eth",
      plugin: ipfsPlugin({
        provider: ipfsProvider,
        fallbackProviders: defaultIpfsProviders,
      }),
    },
    {
      uri: "w3://ens/ens.web3api.eth",
      plugin: ensPlugin({
        addresses: {
          testnet: ensAddress,
        },
      }),
    },
  ];

  return {
    plugins,
  };
}

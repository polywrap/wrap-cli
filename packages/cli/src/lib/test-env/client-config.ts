import { getTestEnvProviders } from "./providers";

import {
  PluginRegistration,
  Web3ApiClientConfig,
  defaultIpfsProviders,
} from "@polywrap/client-js";
import { ensPlugin } from "@polywrap/ens-plugin-js";
import { ethereumPlugin } from "@polywrap/ethereum-plugin-js";
import { ipfsPlugin } from "@polywrap/ipfs-plugin-js";
import { ensAddresses } from "@polywrap/test-env-js";

export async function getTestEnvClientConfig(): Promise<
  Partial<Web3ApiClientConfig>
> {
  const providers = await getTestEnvProviders();
  const ipfsProvider = providers.ipfsProvider;
  const ethProvider = providers.ethProvider;

  if (!ipfsProvider || !ethProvider) {
    throw Error("Test environment not found.");
  }

  const ensAddress = ensAddresses.ensAddress;

  // TODO: move this into its own package, since it's being used everywhere?
  // maybe have it exported from test-env.
  const plugins: PluginRegistration[] = [
    {
      uri: "wrap://ens/ethereum.web3api.eth",
      plugin: ethereumPlugin({
        networks: {
          testnet: {
            provider: ethProvider,
          },
        },
      }),
    },
    {
      uri: "wrap://ens/ipfs.web3api.eth",
      plugin: ipfsPlugin({
        provider: ipfsProvider,
        fallbackProviders: defaultIpfsProviders,
      }),
    },
    {
      uri: "wrap://ens/ens.web3api.eth",
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

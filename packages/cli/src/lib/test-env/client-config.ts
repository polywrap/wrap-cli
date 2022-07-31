import { getTestEnvProviders } from "./providers";

import {
  PluginRegistration,
  PolywrapClientConfig,
  defaultIpfsProviders,
} from "@polywrap/client-js";
import { ensResolverPlugin } from "@polywrap/ens-resolver-plugin-js";
import { ethereumPlugin } from "@polywrap/ethereum-plugin-js";
import { ipfsPlugin } from "@polywrap/ipfs-plugin-js";
import { ensAddresses } from "@polywrap/test-env-js";

export async function getTestEnvClientConfig(): Promise<
  Partial<PolywrapClientConfig>
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
      uri: "wrap://ens/ethereum.polywrap.eth",
      plugin: ethereumPlugin({
        networks: {
          testnet: {
            provider: ethProvider,
          },
        },
      }),
    },
    {
      uri: "wrap://ens/ipfs.polywrap.eth",
      plugin: ipfsPlugin({
        provider: ipfsProvider,
        fallbackProviders: defaultIpfsProviders,
      }),
    },
    {
      uri: "wrap://ens/ens-resolver.polywrap.eth",
      plugin: ensResolverPlugin({
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

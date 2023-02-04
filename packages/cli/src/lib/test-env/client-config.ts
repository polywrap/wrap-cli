import { getTestEnvProviders } from "./providers";

import {
  BuilderConfig,
  defaultIpfsProviders,
} from "@polywrap/client-config-builder-js";
import { ensResolverPlugin } from "@polywrap/ens-resolver-plugin-js";
import {
  ethereumPlugin,
  Connections,
  Connection,
} from "@polywrap/ethereum-plugin-js";
import { ipfsPlugin } from "@polywrap/ipfs-plugin-js";
import { ensAddresses } from "@polywrap/test-env-js";

export function getTestEnvClientConfig(): Partial<BuilderConfig> {
  // TODO: move this into its own package, since it's being used everywhere?
  // maybe have it exported from test-env.
  const providers = getTestEnvProviders();
  const ipfsProvider = providers.ipfsProvider;
  const ethProvider = providers.ethProvider;

  if (!ipfsProvider || !ethProvider) {
    throw Error("Test environment not found.");
  }

  const ensAddress = ensAddresses.ensAddress;

  return {
    envs: {
      "wrap://ens/ipfs.polywrap.eth": {
        provider: ipfsProvider,
        fallbackProviders: defaultIpfsProviders,
      },
    },
    packages: {
      "wrap://ens/ethereum.polywrap.eth": ethereumPlugin({
        connections: new Connections({
          networks: {
            testnet: new Connection({
              provider: ethProvider,
            }),
            mainnet: new Connection({
              provider:
                "https://mainnet.infura.io/v3/b00b2c2cc09c487685e9fb061256d6a6",
            }),
            goerli: new Connection({
              provider:
                "https://goerli.infura.io/v3/b00b2c2cc09c487685e9fb061256d6a6",
            }),
          },
        }),
      }),
      "wrap://ens/ipfs.polywrap.eth": ipfsPlugin({}),
      "wrap://ens/ens-resolver.polywrap.eth": ensResolverPlugin({
        addresses: {
          testnet: ensAddress,
        },
      }),
    },
  };
}

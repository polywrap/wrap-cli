import { getTestEnvProviders } from "./providers";

import {
  BuilderConfig,
  defaultInterfaces,
  defaultIpfsProviders,
  defaultPackages,
} from "@polywrap/client-config-builder-js";
import {
  ethereumProviderPlugin,
  Connections,
  Connection,
} from "ethereum-provider-js";
import { ensAddresses } from "@polywrap/test-env-js";
import { defaultWrappers } from "@polywrap/client-js";

export function getTestEnvClientConfig(): Partial<BuilderConfig> {
  const providers = getTestEnvProviders();
  const ipfsProvider = providers.ipfsProvider;
  const ethProvider = providers.ethProvider;

  if (!ipfsProvider || !ethProvider) {
    throw Error("Test environment not found.");
  }

  const ensAddress = ensAddresses.ensAddress;

  return {
    envs: {
      [defaultPackages.ipfsResolver]: {
        provider: ipfsProvider,
        fallbackProviders: defaultIpfsProviders,
        retries: { tryResolveUri: 1, getFile: 1 },
      },
      [defaultWrappers.ensContenthashResolver]: {
        registryAddress: ensAddress,
      },
    },
    packages: {
      [defaultInterfaces.ethereumProvider]: ethereumProviderPlugin({
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
    },
  };
}

import { getTestEnvProviders } from "./providers";

import { PolywrapClientConfig } from "@polywrap/client-js";
import {
  defaultIpfsProviders,
  defaultPackages,
} from "@polywrap/client-config-builder-js";
import { ensResolverPlugin } from "@polywrap/ens-resolver-plugin-js";
import {
  ethereumProviderPlugin,
  Connections,
  Connection,
} from "ethereum-provider-js";
import { ensAddresses } from "@polywrap/test-env-js";

export function getTestEnvClientConfig(): Partial<PolywrapClientConfig> {
  const providers = getTestEnvProviders();
  const ipfsProvider = providers.ipfsProvider;
  const ethProvider = providers.ethProvider;

  if (!ipfsProvider || !ethProvider) {
    throw Error("Test environment not found.");
  }

  const ensAddress = ensAddresses.ensAddress;

  return {
    envs: [
      {
        uri: "wrap://ens/ipfs.polywrap.eth",
        env: {
          provider: ipfsProvider,
          fallbackProviders: defaultIpfsProviders,
        },
      },
    ],
    packages: [
      {
        uri: defaultPackages.ethereumProvider,
        package: ethereumProviderPlugin({
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
      {
        uri: "wrap://ens/ens-resolver.polywrap.eth",
        package: ensResolverPlugin({
          addresses: {
            testnet: ensAddress,
          },
        }),
      },
    ],
  };
}

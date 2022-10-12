import { getTestEnvProviders } from "./providers";

import { PolywrapClientConfig } from "@polywrap/client-js";
import { defaultIpfsProviders } from "@polywrap/client-config-builder-js";
import { ensResolverPlugin } from "@polywrap/ens-resolver-plugin-js";
import {
  ethereumPlugin,
  Connections,
  Connection,
} from "@polywrap/ethereum-plugin-js";
import { ipfsPlugin } from "@polywrap/ipfs-plugin-js";
import { ensAddresses } from "@polywrap/test-env-js";

export function getTestEnvClientConfig(): Partial<PolywrapClientConfig> {
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
      },
      {
        uri: "wrap://ens/ipfs.polywrap.eth",
        package: ipfsPlugin({}),
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

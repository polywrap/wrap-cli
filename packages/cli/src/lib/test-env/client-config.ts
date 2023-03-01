import { getTestEnvProviders } from "./providers";

import {
  BuilderConfig,
  DefaultBundle,
} from "@polywrap/client-config-builder-js";
import { ExtendableUriResolver } from "@polywrap/uri-resolver-extensions-js";
import {
  ethereumProviderPlugin,
  Connections,
  Connection,
} from "@polywrap/ethereum-provider-js";
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
      [DefaultBundle.uriResolverExts[0].uri.uri]: {
        provider: ipfsProvider,
        fallbackProviders: DefaultBundle.ipfsProviders,
        retries: { tryResolveUri: 1, getFile: 1 },
      },
      "proxy/testnet-ens-uri-resolver-ext": {
        registryAddress: ensAddress,
      },
    },
    redirects: {
      "proxy/testnet-ens-uri-resolver-ext":
        "ens/wraps.eth:ens-uri-resolver-ext@1.0.0",
    },
    packages: {
      [DefaultBundle.plugins.ethereumProvider.uri.uri]: ethereumProviderPlugin({
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
    interfaces: {
      [ExtendableUriResolver.extInterfaceUris[0].uri]: new Set([
        "proxy/testnet-ens-uri-resolver-ext",
        ...DefaultBundle.getConfig().interfaces[
          ExtendableUriResolver.extInterfaceUris[0].uri
        ],
      ]),
    },
  };
}

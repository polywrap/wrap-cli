import { getTestEnvProviders } from "./providers";
import { ETH_ENS_IPFS_MODULE_CONSTANTS } from "../../lib";

import {
  BuilderConfig,
  PolywrapClientConfigBuilder,
} from "@polywrap/client-config-builder-js";
import * as Web3 from "@polywrap/web3-config-bundle-js";
import * as Sys from "@polywrap/sys-config-bundle-js";
import { ExtendableUriResolver } from "@polywrap/uri-resolver-extensions-js";
import {
  ethereumProviderPlugin,
  Connections,
  Connection,
} from "@polywrap/ethereum-provider-js";
import { IWrapPackage } from "@polywrap/core-js";

export function getTestEnvClientConfig(): Partial<BuilderConfig> {
  // TODO: move this into its own package, since it's being used everywhere?
  // maybe have it exported from test-env.
  const providers = getTestEnvProviders();
  const ipfsProvider = providers.ipfsProvider;
  const ethProvider = providers.ethProvider;

  if (!ipfsProvider || !ethProvider) {
    throw Error("Test environment not found.");
  }

  const ensAddress = ETH_ENS_IPFS_MODULE_CONSTANTS.ensAddresses.ensAddress;

  const builder = new PolywrapClientConfigBuilder()
    .addDefaults()
    .addEnvs({
      [Sys.bundle.ipfsResolver.uri]: {
        provider: ipfsProvider,
        retries: { tryResolveUri: 1, getFile: 1 },
      },
      "proxy/testnet-ens-uri-resolver-ext": {
        registryAddress: ensAddress,
      },
    })
    .setRedirects({
      "proxy/testnet-ens-uri-resolver-ext":
        "ens/wraps.eth:ens-uri-resolver-ext@1.0.1",
    })
    .setPackages({
      [Web3.bundle.ethereumProviderV2.uri]: ethereumProviderPlugin({
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
      }) as IWrapPackage,
    });

  const resolverExtensions =
    builder.config.interfaces[
      ExtendableUriResolver.defaultExtInterfaceUris[0].uri
    ];

  builder.addInterfaceImplementations(
    ExtendableUriResolver.defaultExtInterfaceUris[0].uri,
    ["proxy/testnet-ens-uri-resolver-ext", ...resolverExtensions]
  );

  return builder.config;
}

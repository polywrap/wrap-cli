import { ETH_ENS_IPFS_MODULE_CONSTANTS } from "../../lib";

import {
  BuilderConfig,
  PolywrapClientConfigBuilder,
} from "@polywrap/client-config-builder-js";
import * as Web3 from "@polywrap/web3-config-bundle-js";
import * as Sys from "@polywrap/sys-config-bundle-js";
import { ExtendableUriResolver } from "@polywrap/uri-resolver-extensions-js";
import {
  ethereumWalletPlugin,
  Connections,
  Connection,
} from "@polywrap/ethereum-wallet-js";
import { IWrapPackage, Uri } from "@polywrap/core-js";

export function getTestEnvClientConfig(): Partial<BuilderConfig> {
  // TODO: move this into its own package, since it's being used everywhere?
  // maybe have it exported from test-env.
  const ipfsProvider = ETH_ENS_IPFS_MODULE_CONSTANTS.ipfsProvider;
  const ethProvider = ETH_ENS_IPFS_MODULE_CONSTANTS.ethereumProvider;
  const ensAddress = ETH_ENS_IPFS_MODULE_CONSTANTS.ensAddresses.ensAddress;
  const testnetEnsResolverUri = "proxy/testnet-ens-contenthash-uri-resolver";

  const builder = new PolywrapClientConfigBuilder().addDefaults();

  const ipfsResolverEnv =
    builder.config.envs[Uri.from(Sys.bundle.ipfsResolver.uri).toString()];

  builder
    .addEnvs({
      [Sys.bundle.ipfsResolver.uri]: {
        provider: ipfsProvider,
        fallbackProviders: [
          ipfsResolverEnv.provider,
          ...(ipfsResolverEnv.fallbackProviders as string[]),
        ],
        retries: { tryResolveUri: 2, getFile: 2 },
      },
      [testnetEnsResolverUri]: {
        registryAddress: ensAddress,
      },
    })
    .setRedirects({
      [testnetEnsResolverUri]: Web3.bundle.ensContenthashResolver.uri,
    })
    .setPackages({
      [Web3.bundle.ethereumWallet.uri]: ethereumWalletPlugin({
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
    [testnetEnsResolverUri, ...resolverExtensions]
  );

  return builder.config;
}

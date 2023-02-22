import { ensResolverPlugin } from "../..";
import { ensAddresses, providers } from "@polywrap/test-env-js";
import {
  Connection,
  Connections,
  ethereumProviderPlugin,
} from "ethereum-provider-js";
import {
  RecursiveResolver,
  PackageToWrapperCacheResolver,
  WrapperCache,
} from "@polywrap/uri-resolvers-js";
import { PolywrapClient } from "@polywrap/client-js";
import { ExtendableUriResolver } from "@polywrap/uri-resolver-extensions-js";
import {
  defaultEmbeddedPackages,
  defaultInterfaces,
  defaultPackages,
  defaultIpfsProviders,
  defaultWrappers,
} from "@polywrap/client-config-builder-js";
import { httpPlugin } from "@polywrap/http-plugin-js";
import { Uri } from "@polywrap/core-js";

export const getClient = () => {
  return new PolywrapClient({
    envs: {
      [defaultPackages.ipfsResolver]: {
        provider: providers.ipfs,
        fallbackProviders: defaultIpfsProviders,
        retries: { tryResolveUri: 1, getFile: 1 },
      },
    },
    interfaces: [
      {
        interface: ExtendableUriResolver.extInterfaceUri,
        implementations: [
          Uri.from(defaultPackages.ipfsResolver),
          Uri.from(defaultPackages.ensResolver),
          Uri.from(defaultWrappers.ensTextRecordResolver),
        ],
      },
      {
        interface: Uri.from(defaultInterfaces.ipfsHttpClient),
        implementations: [Uri.from(defaultInterfaces.ipfsHttpClient)],
      },
      {
        interface: Uri.from(defaultInterfaces.ethereumProvider),
        implementations: [Uri.from(defaultInterfaces.ethereumProvider)],
      },
    ],
    resolver: RecursiveResolver.from(
      PackageToWrapperCacheResolver.from(
        [
          {
            uri: Uri.from(defaultInterfaces.ipfsHttpClient),
            package: defaultEmbeddedPackages.ipfsHttpClient(),
          },
          {
            uri: Uri.from(defaultPackages.ipfsResolver),
            package: defaultEmbeddedPackages.ipfsResolver(),
          },
          {
            uri: Uri.from(defaultInterfaces.ethereumProvider),
            package: ethereumProviderPlugin({
              connections: new Connections({
                networks: {
                  testnet: new Connection({
                    provider: providers.ethereum,
                  }),
                },
                defaultNetwork: "testnet",
              }),
            }),
          },
          {
            uri: Uri.from(defaultPackages.ensResolver),
            package: ensResolverPlugin({
              addresses: {
                testnet: ensAddresses.ensAddress,
              },
            }),
          },
          {
            uri: Uri.from(defaultInterfaces.http),
            package: httpPlugin({}),
          },
          new ExtendableUriResolver(),
        ],
        new WrapperCache()
      )
    ),
  });
};

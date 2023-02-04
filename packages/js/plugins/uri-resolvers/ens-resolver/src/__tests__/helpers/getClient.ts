import { ensResolverPlugin } from "../..";
import { ensAddresses, providers } from "@polywrap/test-env-js";
import {
  Connection,
  Connections,
  ethereumPlugin,
} from "@polywrap/ethereum-plugin-js";
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
} from "@polywrap/client-config-builder-js";
import { httpPlugin } from "@polywrap/http-plugin-js";
import { Uri } from "@polywrap/core-js";

export const getClient = () => {
  return new PolywrapClient<string>(
    {
      envs: [{
        uri: defaultPackages.ipfsResolver,
        env: {
          provider: providers.ipfs,
          retries: { tryResolveUri: 1, getFile: 1 },
        },
      }],
      interfaces: [
        {
          interface: ExtendableUriResolver.extInterfaceUri.uri,
          implementations: [
            defaultPackages.ipfsResolver,
            defaultPackages.ensResolver,
          ],
        },
        {
          interface: defaultInterfaces.ipfsHttpClient,
          implementations: [defaultInterfaces.ipfsHttpClient],
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
              uri: Uri.from(defaultPackages.ethereum),
              package: ethereumPlugin({
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
    },
    { noDefaults: true }
  );
};

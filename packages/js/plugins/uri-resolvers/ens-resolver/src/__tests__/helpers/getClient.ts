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
  WrapperCache, RedirectResolver,
} from "@polywrap/uri-resolvers-js";
import { PolywrapClient } from "@polywrap/client-js";
import { ExtendableUriResolver } from "@polywrap/uri-resolver-extensions-js";
import { defaultPackages, defaultWrapperAliases, defaultWrappers } from "@polywrap/client-config-builder-js";

export const getClient = () => {
  return new PolywrapClient(
    {
      interfaces: [
        {
          interface: ExtendableUriResolver.extInterfaceUri,
          implementations: [
            defaultWrapperAliases.ipfsResolver,
            defaultPackages.ensResolver,
            defaultPackages.fileSystemResolver,
          ],
        },
      ],
      resolver: RecursiveResolver.from([
        new RedirectResolver(defaultWrapperAliases.ipfsResolver, defaultWrappers.ipfsResolver),
        new RedirectResolver(defaultWrapperAliases.ipfsHttpClient, defaultWrappers.ipfsHttpClient),
        PackageToWrapperCacheResolver.from(
          [
            {
              uri: defaultPackages.ethereum,
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
              uri: defaultPackages.ensResolver,
              package: ensResolverPlugin({
                addresses: {
                  testnet: ensAddresses.ensAddress,
                },
              }),
            },
            new ExtendableUriResolver(),
          ],
          new WrapperCache()
        )
      ]),
    },
    { noDefaults: true }
  );
};

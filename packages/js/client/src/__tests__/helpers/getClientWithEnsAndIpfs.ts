import { PolywrapClient } from "../..";
import { ensAddresses, providers } from "@polywrap/test-env-js";
import {
  Connection,
  Connections,
  ethereumPlugin,
} from "@polywrap/ethereum-plugin-js";
import { fileSystemPlugin } from "@polywrap/fs-plugin-js";
import { fileSystemResolverPlugin } from "@polywrap/fs-resolver-plugin-js";
import { ensResolverPlugin } from "@polywrap/ens-resolver-plugin-js";
import {
  PackageToWrapperCacheResolver,
  RecursiveResolver, RedirectResolver,
  WrapperCache,
} from "@polywrap/uri-resolvers-js";
import { ExtendableUriResolver } from "@polywrap/uri-resolver-extensions-js";
import { defaultPackages, defaultWrapperAliases, defaultWrappers } from "@polywrap/client-config-builder-js";

export const getClientWithEnsAndIpfs = () => {
  const connections: Connections = new Connections({
    networks: {
      testnet: new Connection({
        provider: providers.ethereum,
      }),
    },
    defaultNetwork: "testnet",
  });
  return new PolywrapClient(
    {
      envs: [
        {
          uri: defaultWrapperAliases.ipfsResolver,
          env: {
            provider: providers.ipfs,
          },
        },
      ],
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
              package: ethereumPlugin({ connections }),
            },
            {
              uri: defaultPackages.ensResolver,
              package: ensResolverPlugin({
                addresses: {
                  testnet: ensAddresses.ensAddress,
                },
              }),
            },
            {
              uri: defaultPackages.fileSystem,
              package: fileSystemPlugin({}),
            },
            {
              uri: defaultPackages.fileSystemResolver,
              package: fileSystemResolverPlugin({}),
            },
            new ExtendableUriResolver(),
          ],
          new WrapperCache()
        )
      ]),
    },
    {
      noDefaults: true,
    }
  );
};

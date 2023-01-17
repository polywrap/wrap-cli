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
  StaticResolver,
} from "@polywrap/uri-resolvers-js";
import { PolywrapClient } from "@polywrap/client-js";
import { ipfsPlugin } from "@polywrap/ipfs-plugin-js";
import { ipfsResolverPlugin } from "@polywrap/ipfs-resolver-plugin-js";
import { ExtendableUriResolver } from "@polywrap/uri-resolver-extensions-js";
import {
  defaultInterfaces,
  defaultIpfsProviders,
  defaultPackages,
  defaultWrappers,
} from "@polywrap/client-config-builder-js";
import { fileSystemPlugin } from "@polywrap/fs-plugin-js";
import { fileSystemResolverPlugin } from "@polywrap/fs-resolver-plugin-js";
import { RetryResolver } from "wraplib";

export const getClient = () => {
  return new PolywrapClient(
    {
      envs: [
        {
          uri: defaultPackages.ipfs,
          env: {
            provider: providers.ipfs,
            fallbackProviders: defaultIpfsProviders,
          },
        },
      ],
      interfaces: [
        {
          interface: ExtendableUriResolver.extInterfaceUri,
          implementations: [
            "wrap://ens/ipfs-resolver.polywrap.eth",
            "wrap://ens/ens-resolver.polywrap.eth",
            "wrap://ens/fs-resolver.polywrap.eth",
          ],
        },
        {
          interface: defaultInterfaces.ethereumProvider,
          implementations: [defaultPackages.ethereumProvider],
        },
      ],
      resolver: RecursiveResolver.from(
          PackageToWrapperCacheResolver.from(
          [
            StaticResolver.from([
              {
                from: "wrap://ens/ethereum.polywrap.eth",
                to: defaultWrappers.ethereum
              },
              {
                uri: defaultPackages.ethereumProvider,
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
                uri: "wrap://ens/ens-resolver.polywrap.eth",
                package: ensResolverPlugin({
                  addresses: {
                    testnet: ensAddresses.ensAddress,
                  },
                }),
              },
              {
                uri: "wrap://ens/ipfs-resolver.polywrap.eth",
                package: ipfsResolverPlugin({}),
              },
              {
                uri: "wrap://ens/ipfs.polywrap.eth",
                package: ipfsPlugin({}),
              },
              {
                uri: "wrap://ens/fs.polywrap.eth",
                package: fileSystemPlugin({}),
              },
              {
                uri: "wrap://ens/fs-resolver.polywrap.eth",
                package: fileSystemResolverPlugin({}),
              },
            ]),
            new RetryResolver(new ExtendableUriResolver(), {
              ipfs: { retries: 1, interval: 500 },
            }),
          ],
          new WrapperCache()
        )
      ),
    },
    { noDefaults: true }
  );
};

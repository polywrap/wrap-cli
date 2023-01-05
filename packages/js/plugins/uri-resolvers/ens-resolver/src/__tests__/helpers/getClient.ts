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
  RedirectResolver,
} from "@polywrap/uri-resolvers-js";
import { PolywrapClient } from "@polywrap/client-js";
import { ipfsPlugin } from "@polywrap/ipfs-plugin-js";
import { ipfsResolverPlugin } from "@polywrap/ipfs-resolver-plugin-js";
import { ExtendableUriResolver } from "@polywrap/uri-resolver-extensions-js";
import { defaultInterfaces, defaultWrappers } from "@polywrap/client-config-builder-js";

export const getClient = () => {
  return new PolywrapClient(
    {
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
          implementations: ["wrap://plugin/ethereum-provider"],
        },
      ],
      resolver: RecursiveResolver.from(
        [
          new RedirectResolver(
            "wrap://ens/ethereum.polywrap.eth",
            defaultWrappers.ethereum
          ),
          PackageToWrapperCacheResolver.from(
          [
            {
              uri: "wrap://ens/ipfs-resolver.polywrap.eth",
              package: ipfsResolverPlugin({}),
            },
            {
              uri: "wrap://ens/ipfs.polywrap.eth",
              package: ipfsPlugin({}),
            },
            {
              uri: "wrap://plugin/ethereum-provider",
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
            new ExtendableUriResolver(),
          ],
          new WrapperCache()
        )
        ]
      ),
    },
    { noDefaults: true }
  );
};

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
import { coreInterfaceUris } from "@polywrap/core-js";
import { PolywrapClient } from "@polywrap/client-js";
import { ipfsPlugin } from "@polywrap/ipfs-plugin-js";
import { ipfsResolverPlugin } from "@polywrap/ipfs-resolver-plugin-js";
import { ExtendableUriResolver } from "@polywrap/uri-resolver-extensions-js";

export const getClient = () => {
  return new PolywrapClient({
    interfaces: [
      {
        interface: coreInterfaceUris.uriResolver,
        implementations: [
          "wrap://ens/ipfs-resolver.polywrap.eth",
          "wrap://ens/ens-resolver.polywrap.eth",
          "wrap://ens/fs-resolver.polywrap.eth",
        ],
      },
    ],
    resolver: RecursiveResolver.from(
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
            uri: "wrap://ens/ethereum.polywrap.eth",
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
    ),
  });
};

import { PolywrapClient, Uri } from "../..";
import { ensAddresses, providers } from "@polywrap/test-env-js";
import {
  Connection,
  Connections,
  ethereumPlugin,
} from "@polywrap/ethereum-plugin-js";
import { ipfsPlugin } from "@polywrap/ipfs-plugin-js";
import { fileSystemPlugin } from "@polywrap/fs-plugin-js";
import { fileSystemResolverPlugin } from "@polywrap/fs-resolver-plugin-js";
import { ensResolverPlugin } from "@polywrap/ens-resolver-plugin-js";
import { ipfsResolverPlugin } from "@polywrap/ipfs-resolver-plugin-js";
import {
  PackageToWrapperCacheResolver,
  RecursiveResolver,
  WrapperCache,
} from "@polywrap/uri-resolvers-js";
import { ExtendableUriResolver } from "@polywrap/uri-resolver-extensions-js";
import { defaultInterfaces } from "@polywrap/client-config-builder-js";

export const getClientWithEnsAndIpfs = () => {
  const connections: Connections = new Connections({
    networks: {
      testnet: new Connection({
        provider: providers.ethereum,
      }),
    },
    defaultNetwork: "testnet",
  });

  return new PolywrapClient({
    envs: [
      {
        uri: Uri.from("wrap://ens/ipfs.polywrap.eth"),
        env: {
          provider: providers.ipfs,
        },
      },
    ],
    interfaces: [
      {
        interface: ExtendableUriResolver.extInterfaceUri,
        implementations: [
          Uri.from("wrap://ens/ipfs-resolver.polywrap.eth"),
          Uri.from("wrap://ens/ens-resolver.polywrap.eth"),
          Uri.from("wrap://ens/fs-resolver.polywrap.eth"),
        ],
      },
    ],
    resolver: RecursiveResolver.from(
      PackageToWrapperCacheResolver.from(
        [
          {
            uri: Uri.from("wrap://ens/ethereum.polywrap.eth"),
            package: ethereumPlugin({ connections }),
          },
          {
            uri: Uri.from("wrap://ens/ens-resolver.polywrap.eth"),
            package: ensResolverPlugin({
              addresses: {
                testnet: ensAddresses.ensAddress,
              },
            }),
          },
          {
            uri: Uri.from("wrap://ens/ipfs.polywrap.eth"),
            package: ipfsPlugin({}),
          },
          {
            uri: Uri.from("wrap://ens/ipfs-resolver.polywrap.eth"),
            package: ipfsResolverPlugin({}),
          },
          {
            uri: Uri.from(defaultInterfaces.fileSystem),
            package: fileSystemPlugin({}),
          },
          {
            uri: Uri.from("wrap://ens/fs-resolver.polywrap.eth"),
            package: fileSystemResolverPlugin({}),
          },
          new ExtendableUriResolver(),
        ],
        new WrapperCache()
      )
    ),
  });
};

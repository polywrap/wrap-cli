import { coreInterfaceUris, PolywrapClient } from "../..";
import { ensAddresses, providers } from "@polywrap/test-env-js";
import {
  Connection,
  Connections,
  ethereumPlugin,
} from "@polywrap/ethereum-plugin-js";
import {
  buildUriResolver,
  RecursiveResolver,
  PackageToWrapperCacheResolver,
  WrapperCache,
} from "@polywrap/uri-resolvers-js";
import { ipfsPlugin } from "@polywrap/ipfs-plugin-js";
import { fileSystemPlugin } from "@polywrap/fs-plugin-js";
import { fileSystemResolverPlugin } from "@polywrap/fs-resolver-plugin-js";
import { ensResolverPlugin } from "@polywrap/ens-resolver-plugin-js";
import { ipfsResolverPlugin } from "@polywrap/ipfs-resolver-plugin-js";
import { ExtendableUriResolver } from "@polywrap/uri-resolver-extensions-js";

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
      resolver: new RecursiveResolver(
        new PackageToWrapperCacheResolver(
          new WrapperCache(),
          buildUriResolver([
            {
              uri: "wrap://ens/ethereum.polywrap.eth",
              package: ethereumPlugin({ connections }),
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
              uri: "wrap://ens/ipfs.polywrap.eth",
              package: ipfsPlugin({ provider: providers.ipfs }),
            },
            {
              uri: "wrap://ens/ipfs-resolver.polywrap.eth",
              package: ipfsResolverPlugin({}),
            },
            {
              uri: "wrap://ens/fs.polywrap.eth",
              package: fileSystemPlugin({}),
            },
            {
              uri: "wrap://ens/fs-resolver.polywrap.eth",
              package: fileSystemResolverPlugin({}),
            },
            new ExtendableUriResolver(),
          ])
        )
      ),
    },
    { noDefaults: true }
  );
};

import { providers } from "@polywrap/test-env-js";
import {
  buildUriResolver,
  RecursiveResolver,
  PackageToWrapperCacheResolver,
  WrapperCache,
} from "@polywrap/uri-resolvers-js";
import { coreInterfaceUris } from "@polywrap/core-js";
import { PolywrapClient } from "@polywrap/client-js";
import { ipfsPlugin } from "@polywrap/ipfs-plugin-js";
import { ExtendableUriResolver } from "@polywrap/uri-resolver-extensions-js";
import { ipfsResolverPlugin } from "../..";

export const getClientWithIpfs = () => {
  return new PolywrapClient(
    {
      interfaces: [
        {
          interface: coreInterfaceUris.uriResolver,
          implementations: ["wrap://ens/ipfs-resolver.polywrap.eth"],
        },
      ],
      resolver: new RecursiveResolver(
        new PackageToWrapperCacheResolver(
          new WrapperCache(),
          buildUriResolver([
            {
              uri: "wrap://ens/ipfs.polywrap.eth",
              package: ipfsPlugin({
                provider: providers.ipfs,
              }),
            },
            {
              uri: "wrap://ens/ipfs-resolver.polywrap.eth",
              package: ipfsResolverPlugin({}),
            },
            new ExtendableUriResolver(),
          ])
        )
      ),
    },
    { noDefaults: true }
  );
};

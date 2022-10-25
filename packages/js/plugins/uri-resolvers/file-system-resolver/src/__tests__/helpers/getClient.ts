import {
  RecursiveResolver,
  PackageToWrapperCacheResolver,
  WrapperCache,
} from "@polywrap/uri-resolvers-js";
import { coreInterfaceUris } from "@polywrap/core-js";
import { PolywrapClient } from "@polywrap/client-js";
import { ExtendableUriResolver } from "@polywrap/uri-resolver-extensions-js";
import { fileSystemPlugin } from "@polywrap/fs-plugin-js";
import { fileSystemResolverPlugin } from "../..";

export const getClient = () => {
  return new PolywrapClient(
    {
      interfaces: [
        {
          interface: coreInterfaceUris.uriResolver,
          implementations: ["wrap://ens/fs-resolver.polywrap.eth"],
        },
      ],
      resolver: RecursiveResolver.from(
        PackageToWrapperCacheResolver.from(
          [
            {
              uri: "wrap://ens/fs-resolver.polywrap.eth",
              package: fileSystemResolverPlugin({}),
            },
            {
              uri: "wrap://ens/fs.polywrap.eth",
              package: fileSystemPlugin({}),
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

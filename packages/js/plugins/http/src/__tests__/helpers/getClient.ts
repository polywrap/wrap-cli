import {
  buildUriResolver,
  RecursiveResolver,
  PackageToWrapperCacheResolver,
  WrapperCache,
} from "@polywrap/uri-resolvers-js";
import { coreInterfaceUris } from "@polywrap/core-js";
import { PolywrapClient } from "@polywrap/client-js";
import { fileSystemPlugin } from "@polywrap/fs-plugin-js";
import { fileSystemResolverPlugin } from "@polywrap/fs-resolver-plugin-js";
import { ExtendableUriResolver } from "@polywrap/uri-resolver-extensions-js";
import { httpPlugin } from "../..";

export const getClient = () => {
  return new PolywrapClient(
    {
      interfaces: [
        {
          interface: coreInterfaceUris.uriResolver,
          implementations: ["wrap://ens/fs-resolver.polywrap.eth"],
        },
      ],
      resolver: new RecursiveResolver(
        new PackageToWrapperCacheResolver(
          new WrapperCache(),
          buildUriResolver([
            {
              uri: "wrap://ens/http.polywrap.eth",
              package: httpPlugin({}),
            },
            {
              uri: "wrap://ens/fs-resolver.polywrap.eth",
              package: fileSystemResolverPlugin({}),
            },
            {
              uri: "wrap://ens/fs.polywrap.eth",
              package: fileSystemPlugin({}),
            },
            new ExtendableUriResolver(),
          ])
        )
      ),
    },
    { noDefaults: true }
  );
};

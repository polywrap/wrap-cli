import {
  RecursiveResolver,
  PackageToWrapperCacheResolver,
  WrapperCache,
  StaticResolver,
} from "@polywrap/uri-resolvers-js";
import { PolywrapClient } from "@polywrap/client-js";
import { fileSystemPlugin } from "@polywrap/fs-plugin-js";
import { fileSystemResolverPlugin } from "@polywrap/fs-resolver-plugin-js";
import { ExtendableUriResolver } from "@polywrap/uri-resolver-extensions-js";
import { httpPlugin } from "../..";
import { defaultPackages } from "@polywrap/client-config-builder-js";

export const getClient = () => {
  return new PolywrapClient(
    {
      interfaces: [
        {
          interface: ExtendableUriResolver.extInterfaceUri,
          implementations: ["wrap://ens/fs-resolver.polywrap.eth"],
        },
      ],
      resolver: RecursiveResolver.from(
        PackageToWrapperCacheResolver.from(
          [
            StaticResolver.from([
              {
                uri: "wrap://ens/http.polywrap.eth",
                package: httpPlugin({}),
              },
              {
                uri: "wrap://ens/fs-resolver.polywrap.eth",
                package: fileSystemResolverPlugin({}),
              },
              {
                uri: defaultPackages.fileSystem,
                package: fileSystemPlugin({}),
              },
            ]),
            new ExtendableUriResolver(),
          ],
          new WrapperCache()
        )
      ),
    },
    { noDefaults: true }
  );
};

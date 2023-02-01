import {
  RecursiveResolver,
  PackageToWrapperCacheResolver,
  WrapperCache,
  StaticResolver,
  StaticResolverLike,
} from "@polywrap/uri-resolvers-js";
import { PolywrapClient } from "@polywrap/client-js";
import { fileSystemPlugin } from "@polywrap/fs-plugin-js";
import { fileSystemResolverPlugin } from "@polywrap/fs-resolver-plugin-js";
import { ExtendableUriResolver } from "@polywrap/uri-resolver-extensions-js";
import { wsPlugin } from "../../..";
import { defaultInterfaces, defaultPackages } from "@polywrap/client-config-builder-js";

export const getClient = (staticResolvers?: StaticResolverLike[]) => {
  return new PolywrapClient(
    {
      interfaces: [
        {
          interface: ExtendableUriResolver.extInterfaceUri,
          implementations: [defaultPackages.fileSystemResolver],
        },
      ],
      resolver: RecursiveResolver.from(
        PackageToWrapperCacheResolver.from(
          [
            StaticResolver.from([
              {
                uri: "wrap://ens/ws.polywrap.eth",
                package: wsPlugin({}),
              },
              {
                uri: defaultPackages.fileSystemResolver,
                package: fileSystemResolverPlugin({}),
              },
              {
                uri: defaultInterfaces.fileSystem,
                package: fileSystemPlugin({}),
              },
              ...(staticResolvers ?? []),
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

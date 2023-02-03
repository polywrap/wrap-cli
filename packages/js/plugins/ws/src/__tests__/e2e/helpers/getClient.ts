import {
  RecursiveResolver,
  PackageToWrapperCacheResolver,
  WrapperCache,
  StaticResolver,
  StaticResolverLike,
} from "@polywrap/uri-resolvers-js";
import { PolywrapClient, Uri } from "@polywrap/client-js";
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
          interface: ExtendableUriResolver.extInterfaceUri.uri,
          implementations: [defaultPackages.fileSystemResolver],
        },
      ],
      resolver: RecursiveResolver.from(
        PackageToWrapperCacheResolver.from(
          [
            StaticResolver.from([
              {
                uri: Uri.from("wrap://ens/ws.polywrap.eth"),
                package: wsPlugin({}),
              },
              {
                uri: Uri.from(defaultPackages.fileSystemResolver),
                package: fileSystemResolverPlugin({}),
              },
              {
                uri: Uri.from(defaultInterfaces.fileSystem),
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

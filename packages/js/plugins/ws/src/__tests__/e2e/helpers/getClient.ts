import {
  RecursiveResolver,
  PackageToWrapperCacheResolver,
  WrapperCache,
  StaticResolver,
  StaticResolverLike,
} from "@polywrap/uri-resolvers-js";
import { defaultInterfaces, PolywrapClient, Uri } from "@polywrap/client-js";
import { fileSystemPlugin } from "@polywrap/fs-plugin-js";
import { fileSystemResolverPlugin } from "@polywrap/fs-resolver-plugin-js";
import { ExtendableUriResolver } from "@polywrap/uri-resolver-extensions-js";
import { wsPlugin } from "../../..";

export const getClient = (staticResolvers?: StaticResolverLike[]) => {
  return new PolywrapClient(
    {
      interfaces: [
        {
          interface: ExtendableUriResolver.extInterfaceUri.uri,
          implementations: ["wrap://ens/fs-resolver.polywrap.eth"],
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
                uri: Uri.from("wrap://ens/fs-resolver.polywrap.eth"),
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

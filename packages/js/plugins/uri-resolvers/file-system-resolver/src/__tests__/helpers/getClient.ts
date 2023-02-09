import {
  RecursiveResolver,
  PackageToWrapperCacheResolver,
  WrapperCache,
} from "@polywrap/uri-resolvers-js";
import { defaultInterfaces, PolywrapClient, Uri } from "@polywrap/client-js";
import { ExtendableUriResolver } from "@polywrap/uri-resolver-extensions-js";
import { fileSystemPlugin } from "@polywrap/fs-plugin-js";
import { fileSystemResolverPlugin } from "../..";

export const getClient = () => {
  return new PolywrapClient<string>(
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
            {
              uri: Uri.from("wrap://ens/fs-resolver.polywrap.eth"),
              package: fileSystemResolverPlugin({}),
            },
            {
              uri: Uri.from(defaultInterfaces.fileSystem),
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

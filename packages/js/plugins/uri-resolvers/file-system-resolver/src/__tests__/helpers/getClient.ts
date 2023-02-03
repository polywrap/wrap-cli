import {
  RecursiveResolver,
  PackageToWrapperCacheResolver,
  WrapperCache,
} from "@polywrap/uri-resolvers-js";
import { defaultInterfaces, PolywrapClient, Uri } from "@polywrap/client-js";
import { ExtendableUriResolver } from "@polywrap/uri-resolver-extensions-js";
import { fileSystemPlugin } from "@polywrap/fs-plugin-js";
import { fileSystemResolverPlugin } from "../..";
import { defaultInterfaces, defaultPackages } from "@polywrap/client-config-builder-js";

export const getClient = () => {
  return new PolywrapClient<string>(
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
            {
              uri: Uri.from(defaultPackages.fileSystemResolver),
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

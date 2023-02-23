import {
  RecursiveResolver,
  PackageToWrapperCacheResolver,
  WrapperCache,
} from "@polywrap/uri-resolvers-js";
import { PolywrapClient, Uri } from "@polywrap/client-js";
import { ExtendableUriResolver } from "@polywrap/uri-resolver-extensions-js";
import { fileSystemPlugin } from "@polywrap/fs-plugin-js";
import { fileSystemResolverPlugin } from "../..";
import {
  defaultInterfaces,
  defaultPackages,
} from "@polywrap/client-config-builder-js";

export const getClient = () => {
  return new PolywrapClient({
    interfaces: {
      [ExtendableUriResolver.extInterfaceUri.uri]: [
        defaultPackages.fileSystemResolver,
      ],
    },
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
  });
};

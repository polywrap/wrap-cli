import {
  RecursiveResolver,
  PackageToWrapperCacheResolver,
  WrapperCache,
} from "@polywrap/uri-resolvers-js";
import { IWrapPackage, PolywrapClient, Uri } from "@polywrap/client-js";
import { ExtendableUriResolver } from "@polywrap/uri-resolver-extensions-js";
import { httpPlugin } from "@polywrap/http-plugin-js";
import { httpResolverPlugin } from "../..";
import {
  defaultInterfaces,
  defaultPackages,
} from "@polywrap/client-config-builder-js";

export const getClient = () => {
  return new PolywrapClient({
    interfaces: [
      {
        interface: ExtendableUriResolver.extInterfaceUri,
        implementations: [Uri.from(defaultPackages.httpResolver)],
      },
    ],
    resolver: RecursiveResolver.from(
      PackageToWrapperCacheResolver.from(
        [
          {
            uri: Uri.from(defaultInterfaces.http),
            package: httpPlugin({}) as IWrapPackage,
          },
          {
            uri: Uri.from(defaultPackages.httpResolver),
            package: httpResolverPlugin({}),
          },
          new ExtendableUriResolver(),
        ],
        new WrapperCache()
      )
    ),
  });
};

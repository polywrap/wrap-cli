import {
  RecursiveResolver,
  PackageToWrapperCacheResolver,
  WrapperCache,
} from "@polywrap/uri-resolvers-js";
import { PolywrapClient } from "@polywrap/client-js";
import { ExtendableUriResolver } from "@polywrap/uri-resolver-extensions-js";
import { httpPlugin } from "@polywrap/http-plugin-js";
import { httpResolverPlugin } from "../..";

export const getClient = () => {
  return new PolywrapClient(
    {
      interfaces: [
        {
          interface: ExtendableUriResolver.InterfaceUri,
          implementations: ["wrap://ens/http-uri-resolver.polywrap.eth"],
        },
      ],
      resolver: RecursiveResolver.from(
        PackageToWrapperCacheResolver.from(
          [
            {
              uri: "wrap://ens/http.polywrap.eth",
              package: httpPlugin({}),
            },
            {
              uri: "wrap://ens/http-uri-resolver.polywrap.eth",
              package: httpResolverPlugin({}),
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

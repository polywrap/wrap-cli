import {
  RecursiveResolver,
  PackageToWrapperCacheResolver,
  WrapperCache,
} from "@polywrap/uri-resolvers-js";
import { PolywrapClient, Uri } from "@polywrap/client-js";
import { ExtendableUriResolver } from "@polywrap/uri-resolver-extensions-js";
import { httpPlugin } from "@polywrap/http-plugin-js";
import { httpResolverPlugin } from "../..";

export const getClient = () => {
  return new PolywrapClient<string>(
    {
      interfaces: [
        {
          interface: ExtendableUriResolver.extInterfaceUri.uri,
          implementations: ["wrap://ens/http-uri-resolver.polywrap.eth"],
        },
      ],
      resolver: RecursiveResolver.from(
        PackageToWrapperCacheResolver.from(
          [
            {
              uri: Uri.from("wrap://ens/http.polywrap.eth"),
              package: httpPlugin({}),
            },
            {
              uri: Uri.from("wrap://ens/http-uri-resolver.polywrap.eth"),
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

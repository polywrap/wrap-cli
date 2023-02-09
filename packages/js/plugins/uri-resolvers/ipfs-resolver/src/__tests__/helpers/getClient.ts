import {
  RecursiveResolver,
  PackageToWrapperCacheResolver,
  WrapperCache,
} from "@polywrap/uri-resolvers-js";
import { PolywrapClient, Uri } from "@polywrap/client-js";
import { ipfsPlugin } from "@polywrap/ipfs-plugin-js";
import { ExtendableUriResolver } from "@polywrap/uri-resolver-extensions-js";
import { providers } from "@polywrap/test-env-js";
import { ipfsResolverPlugin } from "../..";

export const getClient = (env: Record<string, unknown>) => {
  return new PolywrapClient<string>(
    {
      envs: [
        {
          uri: "wrap://ens/ipfs.polywrap.eth",
          env: {
            provider: providers.ipfs,
          },
        },
        {
          uri: "wrap://ens/ipfs-resolver.polywrap.eth",
          env: env,
        },
      ],
      interfaces: [
        {
          interface: ExtendableUriResolver.extInterfaceUri.uri,
          implementations: ["wrap://ens/ipfs-resolver.polywrap.eth"],
        },
      ],
      resolver: RecursiveResolver.from(
        PackageToWrapperCacheResolver.from(
          [
            {
              uri: Uri.from("wrap://ens/ipfs.polywrap.eth"),
              package: ipfsPlugin({}),
            },
            {
              uri: Uri.from("wrap://ens/ipfs-resolver.polywrap.eth"),
              package: ipfsResolverPlugin({}),
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

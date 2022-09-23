import { ipfsPlugin } from "../..";
import { providers } from "@polywrap/test-env-js";
import { PolywrapClient } from "@polywrap/client-js";
import {
  buildUriResolver,
  RecursiveResolver,
  PackageToWrapperCacheResolver,
  WrapperCache,
} from "@polywrap/uri-resolvers-js";

export const getClientIpfs = (): PolywrapClient => {
  return new PolywrapClient(
    {
      resolver: new RecursiveResolver(
        new PackageToWrapperCacheResolver(
          new WrapperCache(),
          buildUriResolver([
            {
              uri: "wrap://ens/ipfs.polywrap.eth",
              package: ipfsPlugin({ provider: providers.ipfs }),
            },
          ])
        )
      ),
    },
    { noDefaults: true }
  );
};

import { CoreClientConfig, Uri, UriMap } from "@polywrap/core-js";
import {
  PackageResolver,
  PackageToWrapperCacheResolver,
  RecursiveResolver,
  RedirectResolver,
  StaticResolver,
  WrapperCache,
} from "@polywrap/uri-resolvers-js";
import { ExtendableUriResolver } from "../build";

export function example(): CoreClientConfig {
  const redirects: RedirectResolver[] = [];
  // TODO: WrapperResolver is not exported. When that is fixed, change this type to WrapperResolver[]
  const wrappers: PackageResolver[] = [];
  const packages: PackageResolver[] = [];
  // $start: quickstart-example
  const clientConfig: CoreClientConfig = {
    interfaces: new UriMap<Uri[]>([
      [
        Uri.from("wrap://ens/uri-resolver.core.polywrap.eth"),
        [
          Uri.from("wrap://ens/fs-resolver.polywrap.eth"),
          Uri.from("wrap://ens/ipfs-resolver.polywrap.eth"),
          Uri.from("wrap://ens/ens-resolver.polywrap.eth"),
        ],
      ],
    ]),
    resolver: RecursiveResolver.from(
      PackageToWrapperCacheResolver.from(
        [
          StaticResolver.from([...redirects, ...wrappers, ...packages]),
          new ExtendableUriResolver(),
        ],
        new WrapperCache()
      )
    ),
  };
  // $end

  return clientConfig;
}

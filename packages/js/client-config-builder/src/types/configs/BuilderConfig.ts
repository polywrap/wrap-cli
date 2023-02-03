import { Wrapper, IWrapPackage } from "@polywrap/core-js";
import { UriResolverLike } from "@polywrap/uri-resolvers-js";

export interface BuilderConfig {
  envs: Record<string, Record<string, unknown>>;
  interfaces: Record<string, Set<string>>;
  redirects: Record<string, string>;
  wrappers: Record<string, Wrapper>;
  packages: Record<string, IWrapPackage>;
  resolvers: UriResolverLike[];
}

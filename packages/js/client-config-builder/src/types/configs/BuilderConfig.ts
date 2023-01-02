import { TEnv, TUri } from "../IClientConfigBuilder";

import { Wrapper, IWrapPackage } from "@polywrap/core-js";
import { UriResolverLike } from "@polywrap/uri-resolvers-js";

export interface BuilderConfig {
  envs: Record<TUri, TEnv>;
  interfaces: Record<TUri, Set<TUri>>;
  redirects: Record<TUri, TUri>;
  wrappers: Record<TUri, Wrapper>;
  packages: Record<TUri, IWrapPackage>;
  resolvers: UriResolverLike[];
}

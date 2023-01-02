import {
  Env,
  InterfaceImplementations,
  IUriPackage,
  IUriRedirect,
  IUriWrapper,
  UriResolverLike,
} from "./types";

import { IWrapperCache } from "@polywrap/uri-resolvers-js";
import { TracerConfig } from "@polywrap/tracing-js";
import { Uri } from "@polywrap/core-js";

export interface PolywrapClientConfig<TUri extends Uri | string = string> {
  readonly envs: Env<TUri>[];
  readonly interfaces: InterfaceImplementations<TUri>[];
  readonly redirects: IUriRedirect<TUri>[];
  readonly wrappers: IUriWrapper<TUri>[];
  readonly packages: IUriPackage<TUri>[];
  readonly resolvers: UriResolverLike<TUri>;
  readonly wrapperCache?: IWrapperCache;
  readonly tracerConfig?: Readonly<Partial<TracerConfig>>;
}

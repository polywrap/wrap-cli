import {
  Uri,
  Env,
  InterfaceImplementations,
  IUriRedirect,
  IUriPackage,
  IUriWrapper,
} from "@polywrap/core-js";
import { UriResolverLike } from "@polywrap/uri-resolvers-js";

export interface ClientConfig<TUri extends Uri | string = Uri | string> {
  readonly envs: Env<TUri>[];
  readonly interfaces: InterfaceImplementations<TUri>[];
  readonly redirects: IUriRedirect<TUri>[];
  readonly wrappers: IUriWrapper<TUri>[];
  readonly packages: IUriPackage<TUri>[];
  readonly resolvers: UriResolverLike[];
}

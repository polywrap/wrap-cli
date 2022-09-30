import {
  Uri,
  Env,
  InterfaceImplementations,
  IUriRedirect,
  IUriPackage,
  IUriWrapper,
} from "@polywrap/core-js";
import { UriResolverLike } from "@polywrap/uri-resolvers-js";

export type CustomClientConfig<TUri extends Uri | string> = {
  redirects: IUriRedirect<TUri>[];
  interfaces: InterfaceImplementations<TUri>[];
  envs: Env<TUri>[];
  wrappers: IUriWrapper<TUri>[];
  packages: IUriPackage<TUri>[];
  resolvers: UriResolverLike[];
};

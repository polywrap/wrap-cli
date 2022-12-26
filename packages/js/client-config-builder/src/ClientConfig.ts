import {
  Env,
  InterfaceImplementations,
  IUriRedirect,
  IUriPackage,
  IUriWrapper,
} from "@polywrap/core-js";
import { UriResolverLike } from "@polywrap/uri-resolvers-js";

export interface ClientConfig {
  readonly envs: Env[];
  readonly interfaces: InterfaceImplementations[];
  readonly redirects: IUriRedirect[];
  readonly wrappers: IUriWrapper[];
  readonly packages: IUriPackage[];
  readonly resolvers: UriResolverLike[];
}

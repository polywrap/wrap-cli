import {
  IUriResolver,
  IUriRedirect,
  IUriPackage,
  IUriWrapper,
} from "@polywrap/core-js";

export type UriResolverLike =
  | IUriResolver<unknown>
  | IUriRedirect
  | IUriPackage
  | IUriWrapper
  | UriResolverLike[];

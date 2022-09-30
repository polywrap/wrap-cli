import {
  Uri,
  IUriResolver,
  IUriRedirect,
  IUriPackage,
  IUriWrapper,
} from "@polywrap/core-js";

export type UriResolverLike =
  | IUriResolver<unknown>
  | IUriRedirect<Uri | string>
  | IUriPackage<Uri | string>
  | IUriWrapper<Uri | string>
  | UriResolverLike[];

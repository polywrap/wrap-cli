import { IUriRedirect, IUriPackage, IUriWrapper } from "@polywrap/core-js";

export type StaticResolverLike =
  | IUriRedirect
  | IUriPackage
  | IUriWrapper
  | StaticResolverLike[];

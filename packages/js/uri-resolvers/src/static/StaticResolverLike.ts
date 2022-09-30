import { IUriRedirect, Uri, IUriPackage, IUriWrapper } from "@polywrap/core-js";

export type StaticResolverLike =
  | IUriRedirect<Uri | string>
  | IUriPackage<Uri | string>
  | IUriWrapper<Uri | string>
  | StaticResolverLike[];

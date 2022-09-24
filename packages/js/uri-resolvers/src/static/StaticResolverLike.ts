import { UriRedirect, Uri, IUriPackage, IUriWrapper } from "@polywrap/core-js";
import { PackageRegistration, WrapperRegistration } from "../helpers";

export type StaticResolverLike =
  | UriRedirect<string | Uri>
  | IUriPackage
  | IUriWrapper
  | PackageRegistration
  | WrapperRegistration
  | StaticResolverLike[];

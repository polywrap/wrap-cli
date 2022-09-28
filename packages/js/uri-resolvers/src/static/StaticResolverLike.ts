import { PackageRegistration, WrapperRegistration } from "../helpers";

import { UriRedirect, Uri, IUriPackage, IUriWrapper } from "@polywrap/core-js";

export type StaticResolverLike =
  | UriRedirect<string | Uri>
  | IUriPackage
  | IUriWrapper
  | PackageRegistration
  | WrapperRegistration
  | StaticResolverLike[];

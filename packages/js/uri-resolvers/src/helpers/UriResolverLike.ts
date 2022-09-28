import { PackageRegistration } from "./PackageRegistration";
import { WrapperRegistration } from "./WrapperRegistration";

import {
  IUriResolver,
  UriRedirect,
  Uri,
  IUriPackage,
  IUriWrapper,
} from "@polywrap/core-js";

export type UriResolverLike =
  | IUriResolver<unknown>
  | UriRedirect<string | Uri>
  | IUriPackage
  | IUriWrapper
  | PackageRegistration
  | WrapperRegistration
  | UriResolverLike[];

import {
  IUriResolver,
  UriRedirect,
  Uri,
  IUriPackage,
  IUriWrapper,
} from "@polywrap/core-js";
import { PackageRegistration } from "./PackageRegistration";
import { WrapperRegistration } from "./WrapperRegistration";

export type UriResolverLike =
  | IUriResolver<unknown>
  | UriRedirect<string | Uri>
  | IUriPackage
  | IUriWrapper
  | PackageRegistration
  | WrapperRegistration
  | UriResolverLike[];

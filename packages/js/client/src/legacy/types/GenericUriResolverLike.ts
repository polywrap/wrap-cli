import { IGenericUriPackage } from "./GenericIUriPackage";
import { IGenericUriRedirect } from "./GenericIUriRedirect";
import { IGenericUriWrapper } from "./GenericIUriWrapper";

import { IUriResolver, Uri } from "@polywrap/core-js";

export type GenericUriResolverLike<TUri extends Uri | string = string> =
  | IUriResolver<unknown>
  | IGenericUriRedirect<TUri>
  | IGenericUriPackage<TUri>
  | IGenericUriWrapper<TUri>
  | GenericUriResolverLike[];

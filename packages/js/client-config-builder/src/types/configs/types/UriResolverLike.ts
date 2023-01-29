import { IGenericUriPackage } from "./IUriPackage";
import { IGenericUriRedirect } from "./IUriRedirect";
import { IGenericUriWrapper } from "./IUriWrapper";

import { IUriResolver, Uri } from "@polywrap/core-js";

export type GenericUriResolverLike<TUri extends Uri | string = string> =
  | IUriResolver<unknown>
  | IGenericUriRedirect<TUri>
  | IGenericUriPackage<TUri>
  | IGenericUriWrapper<TUri>
  | GenericUriResolverLike[];

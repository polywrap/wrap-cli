import { Uri } from "@polywrap/core-js";

export interface IGenericUriRedirect<TUri extends Uri | string = string> {
  from: TUri;
  to: TUri;
}

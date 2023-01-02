import { Uri } from "@polywrap/core-js";

export interface IUriRedirect<TUri extends Uri | string = string> {
  from: TUri;
  to: TUri;
}

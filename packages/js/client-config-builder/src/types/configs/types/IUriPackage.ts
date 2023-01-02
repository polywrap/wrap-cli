import { Uri, IWrapPackage } from "@polywrap/core-js";

export interface IUriPackage<TUri extends Uri | string = string> {
  uri: TUri;
  package: IWrapPackage;
}

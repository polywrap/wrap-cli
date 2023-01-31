import { Uri, IWrapPackage } from "@polywrap/core-js";

export interface IGenericUriPackage<TUri extends Uri | string = string> {
  uri: TUri;
  package: IWrapPackage;
}

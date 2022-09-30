import { Uri, IWrapPackage } from ".";

export interface IUriPackage<TUri extends Uri | string> {
  uri: TUri;
  package: IWrapPackage;
}

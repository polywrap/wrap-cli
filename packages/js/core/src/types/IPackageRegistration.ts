import { IWrapPackage, Uri } from ".";

export interface IPackageRegistration<TUri extends Uri | string = string> {
  uri: TUri;
  package: IWrapPackage;
}

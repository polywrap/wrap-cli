import { IWrapPackage, Uri } from "@polywrap/core-js";

export type PackageRegistration = {
  uri: string | Uri;
  package: IWrapPackage;
};

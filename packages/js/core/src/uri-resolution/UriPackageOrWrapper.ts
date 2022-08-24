import { Uri, IWrapPackage, Wrapper } from "..";

export type UriValue = {
  type: "uri";
  uri: Uri;
};

export type PackageValue = {
  type: "package";
  package: IWrapPackage;
};

export type WrapperValue = {
  type: "wrapper";
  wrapper: Wrapper;
};

export type UriPackageOrWrapper = UriValue | PackageValue | WrapperValue;

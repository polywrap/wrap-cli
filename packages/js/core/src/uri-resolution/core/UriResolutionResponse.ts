import { Uri, Wrapper, IWrapPackage } from "../..";

type UriValue = {
  type: "uri";
  uri: Uri;
};

type PackageValue = {
  type: "package";
  package: IWrapPackage;
};

type WrapperValue = {
  type: "wrapper";
  wrapper: Wrapper;
};

export type UriPackageOrWrapper = UriValue | PackageValue | WrapperValue;

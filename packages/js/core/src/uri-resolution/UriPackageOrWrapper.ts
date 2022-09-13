import { Uri } from "..";
import { IUriPackage, IUriWrapper } from "../types";

export type UriValue = {
  type: "uri";
  uri: Uri;
};

export type UriPackageValue = IUriPackage & {
  type: "package";
};

export type UriWrapperValue = IUriWrapper & {
  type: "wrapper";
};

export type UriPackageOrWrapper = UriValue | UriPackageValue | UriWrapperValue;

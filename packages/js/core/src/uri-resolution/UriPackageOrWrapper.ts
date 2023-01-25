import { Uri } from "..";
import { IUriPackage, IUriWrapper } from "../types";

// $start: UriPackageOrWrapper.ts

/** Indicates that a URI resolved to a Uri */
export type UriValue = {
  type: "uri";
  uri: Uri;
};

/** Indicates that a URI resolved to a wrap package */
export type UriPackageValue = IUriPackage & {
  type: "package";
};

/** Indicates that a URI resolved to a wrapper */
export type UriWrapperValue = IUriWrapper & {
  type: "wrapper";
};

/** indicates that a URI resolved to either a wrap package, a wrapper, or a URI */
export type UriPackageOrWrapper = UriValue | UriPackageValue | UriWrapperValue;

// $end

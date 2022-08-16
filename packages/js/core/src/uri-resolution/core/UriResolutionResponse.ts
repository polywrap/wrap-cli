import { Uri, Wrapper, IWrapPackage } from "../..";

type UriResolutionResponseUri = {
  type: "uri";
  uri: Uri;
};

type UriResolutionResponsePackage = {
  type: "package";
  package: IWrapPackage;
};

type UriResolutionResponseWrapper = {
  type: "wrapper";
  wrapper: Wrapper;
};

export type UriResolutionResponse =
  | UriResolutionResponseUri
  | UriResolutionResponsePackage
  | UriResolutionResponseWrapper;

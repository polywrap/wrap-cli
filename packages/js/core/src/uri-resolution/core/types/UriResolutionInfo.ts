import { Uri } from "../../../types";

export interface UriResolutionInfo {
  uriResolver: string;
  sourceUri: Uri;
  result: {
    uri: Uri;
    wrapper: boolean;
  };
}

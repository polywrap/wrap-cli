import { Uri } from "../../../types";

export interface UriResolutionStep {
  uriResolver: string;
  sourceUri: Uri;
  result: {
    uri: Uri;
    wrapper: boolean;
  };
}

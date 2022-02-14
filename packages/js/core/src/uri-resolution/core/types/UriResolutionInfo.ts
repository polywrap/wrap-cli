import { Uri } from "../../../types";

export interface UriResolutionInfo {
  resolver: string;
  sourceUri: Uri;
  result: {
    uri: Uri;
    api: boolean;
  };
}

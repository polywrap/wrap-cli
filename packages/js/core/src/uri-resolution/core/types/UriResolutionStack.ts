import { Uri } from "../../../types";

export type UriResolutionStack = {
  resolver: string;
  sourceUri: Uri;
  result: {
    uri: Uri;
    api: boolean;
  };
}[];

import { Api, Uri } from ".";
import { ResolveUriError, UriResolutionHistory } from "..";

export type ResolveUriResult = {
  api?: Api;
  uri?: Uri;
  uriHistory: UriResolutionHistory;
  error?: {
    type: ResolveUriError;
    error?: Error;
  };
};

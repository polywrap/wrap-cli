import { Api, ResolveUriError, Uri } from "../../..";

export interface UriResolutionResult {
  uri: Uri;
  api?: Api;
  error?: ResolveUriError;
}

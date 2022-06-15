import { Wrapper, Uri } from "../../..";

export interface UriResolutionResult {
  uri: Uri;
  wrapper?: Wrapper;
  error?: Error;
}

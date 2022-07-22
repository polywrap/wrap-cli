import { Wrapper, Uri } from "../../..";

export interface ResolveUriResult<TError> {
  uri: Uri;
  wrapper?: Wrapper;
  error?: TError;
}

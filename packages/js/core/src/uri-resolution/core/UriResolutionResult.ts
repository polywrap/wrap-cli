import { IUriResolutionResult } from ".";

export interface UriResolutionResult<TError = undefined>
  extends IUriResolutionResult {
  error?: TError;
}

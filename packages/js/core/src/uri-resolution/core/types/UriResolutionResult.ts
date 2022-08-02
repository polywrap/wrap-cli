import { IUriResolutionResult } from ".";

export interface UriResolutionResult<TError> extends IUriResolutionResult {
  error?: TError;
}

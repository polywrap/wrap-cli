import { IUriResolutionResult } from ".";
import { IUriResolutionError } from "./errors";

export interface UriResolutionResult<TError extends IUriResolutionError>
  extends IUriResolutionResult {
  error?: TError;
}

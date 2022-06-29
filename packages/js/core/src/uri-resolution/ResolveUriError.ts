import { ResolveUriErrorType } from ".";

export interface ResolveUriError {
  type: ResolveUriErrorType;
  error?: Error;
}

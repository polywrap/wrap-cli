import { Uri } from "../..";
import { UriResolutionResult } from ".";

export interface IUriResolutionStep<TError = undefined> {
  resolverName: string;
  sourceUri: Uri;
  result: UriResolutionResult<TError>;
}

import { Uri } from "../..";
import { IUriResolutionResult } from ".";

export interface IUriResolutionStep<TError = undefined> {
  resolverName: string;
  sourceUri: Uri;
  result: IUriResolutionResult<TError>;
}

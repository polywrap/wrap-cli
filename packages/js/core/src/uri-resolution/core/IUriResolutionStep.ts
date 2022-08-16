import { Uri } from "../..";
import { IUriResolutionResponse } from ".";

export interface IUriResolutionStep<TError = undefined> {
  resolverName: string;
  sourceUri: Uri;
  response: IUriResolutionResponse<TError>;
}

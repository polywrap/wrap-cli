import { IUriResolutionResponse } from ".";
import { Uri } from "..";

export interface IUriResolutionStep<TError = undefined> {
  resolverName: string;
  sourceUri: Uri;
  response: IUriResolutionResponse<TError>;
}
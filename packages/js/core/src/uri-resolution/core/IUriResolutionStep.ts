import { Uri } from "../..";
import { IUriResolutionResult } from ".";

export interface IUriResolutionStep {
  resolverName: string;
  sourceUri: Uri;
  result: IUriResolutionResult;
}

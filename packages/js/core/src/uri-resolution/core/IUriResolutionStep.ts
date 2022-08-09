import { Uri } from "../..";
import { IUriResolutionResult } from ".";

export interface IUriResolutionStep {
  uriResolver: string;
  sourceUri: Uri;
  result: IUriResolutionResult;
}

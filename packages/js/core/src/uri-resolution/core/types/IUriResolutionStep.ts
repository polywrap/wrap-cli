import { Uri } from "../../../types";
import { IUriResolutionResult } from "./IUriResolutionResult";

export interface IUriResolutionStep {
  uriResolver: string;
  sourceUri: Uri;
  result: IUriResolutionResult;
}

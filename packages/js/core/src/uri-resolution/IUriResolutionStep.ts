import { Result } from "@polywrap/result";
import { Uri } from "..";
import { UriPackageOrWrapper } from "./UriPackageOrWrapper";

export interface IUriResolutionStep<TError = undefined> {
  sourceUri: Uri;
  result: Result<UriPackageOrWrapper, TError>;
  description?: string;
  subHistory?: IUriResolutionStep<TError>[];
}

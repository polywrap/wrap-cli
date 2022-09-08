import { Uri } from "..";
import { UriPackageOrWrapper } from "./UriPackageOrWrapper";

import { Result } from "@polywrap/result";

export interface IUriResolutionStep<TError = undefined> {
  sourceUri: Uri;
  result: Result<UriPackageOrWrapper, TError>;
  description?: string;
  subHistory?: IUriResolutionStep<TError>[];
}

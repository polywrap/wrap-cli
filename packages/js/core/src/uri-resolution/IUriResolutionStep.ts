import { Uri } from "..";
import { UriPackageOrWrapper } from "./UriPackageOrWrapper";

import { Result } from "@polywrap/result";

// $start: IUriResolutionStep
/** A step in the URI resolution algorithm */
export interface IUriResolutionStep<TError = undefined> {
  /** The current URI being resolved */
  sourceUri: Uri;

  /** The resolution result for the current URI */
  result: Result<UriPackageOrWrapper, TError>;

  /** A text/visual description of this URI step */
  description?: string;

  /** History of sub-steps that exist within the context of this URI resolution step */
  subHistory?: IUriResolutionStep<TError>[];
}
// $end

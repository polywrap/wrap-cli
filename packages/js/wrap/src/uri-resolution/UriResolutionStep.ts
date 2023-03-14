import { Uri, UriPackageOrWrapper } from ".";

import { Result } from "@polywrap/result";

// $start: UriResolutionStep
/** A step in the URI resolution algorithm */
export interface UriResolutionStep<TError = undefined> {
  /** The current URI being resolved */
  sourceUri: Uri;

  /** The resolution result for the current URI */
  result: Result<UriPackageOrWrapper, TError>;

  /** A text/visual description of this URI step */
  description?: string;

  /** History of sub-steps that exist within the context of this URI resolution step */
  subHistory?: UriResolutionStep<TError>[];
}
// $end

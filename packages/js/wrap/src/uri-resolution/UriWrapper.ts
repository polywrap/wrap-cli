import { Uri } from ".";
import { Wrapper } from "../wrapper";

// $start: UriWrapper.ts

/** Associates a URI with an embedded wrapper */
export interface UriWrapper {
  /** The URI to resolve to the wrapper */
  uri: Uri;

  /** A wrapper instance */
  wrapper: Wrapper;
}

// $end

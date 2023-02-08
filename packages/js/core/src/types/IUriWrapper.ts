import { Uri, Wrapper } from ".";

// $start: IUriWrapper.ts

/** Associates a URI with an embedded wrapper */
export interface IUriWrapper {
  /** The URI to resolve to the wrapper */
  uri: Uri;

  /** A wrapper instance */
  wrapper: Wrapper;
}

// $end

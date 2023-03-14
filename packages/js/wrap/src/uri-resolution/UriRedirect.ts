import { Uri } from ".";

// $start: UriRedirect.ts

/** Redirect invocations from one URI to another */
export interface UriRedirect {
  /** URI to redirect from */
  from: Uri;

  /** URI to redirect to */
  to: Uri;
}

// $end

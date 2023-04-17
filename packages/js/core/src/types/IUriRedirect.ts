import { Uri } from ".";

// $start: IUriRedirect.ts

/** Redirect invocations from one URI to another */
export interface IUriRedirect {
  /** URI to redirect from */
  from: Uri;

  /** URI to redirect to */
  to: Uri;
}

// $end

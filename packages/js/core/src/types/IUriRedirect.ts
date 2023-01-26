import { Uri } from ".";

// $start: IUriRedirect.ts

/** Redirect invocations from one URI to another */
export interface IUriRedirect<TUri extends Uri | string> {
  /** URI to redirect from */
  from: TUri;

  /** URI to redirect to */
  to: TUri;
}

// $end

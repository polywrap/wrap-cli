import { Uri, Wrapper } from ".";

// $start: IUriWrapper.ts

/** Associates a URI with an embedded wrapper */
export interface IUriWrapper<TUri extends Uri | string> {
  /** The URI to resolve to the wrapper */
  uri: TUri;

  /** A wrapper instance */
  wrapper: Wrapper;
}

// $end

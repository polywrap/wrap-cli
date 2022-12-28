import { Uri, IWrapPackage } from ".";

// $start: IUriPackage.ts

/** Associates a URI with an embedded wrap package */
export interface IUriPackage<TUri extends Uri | string> {
  /** The package's URI */
  uri: TUri;

  /** The wrap package */
  package: IWrapPackage;
}

// $end

import { Uri, IWrapPackage } from ".";

// $start: IUriPackage.ts

/** Associates a URI with an embedded wrap package */
export interface IUriPackage {
  /** The package's URI */
  uri: Uri;

  /** The wrap package */
  package: IWrapPackage;
}

// $end

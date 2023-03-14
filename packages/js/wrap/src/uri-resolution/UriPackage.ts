import { Uri } from ".";
import { WrapPackage } from "../package";

// $start: UriPackage.ts

/** Associates a URI with an embedded wrap package */
export interface UriPackage {
  /** The package's URI */
  uri: Uri;

  /** The wrap package */
  package: WrapPackage;
}

// $end

import { Uri } from ".";

// $start: InterfaceImplementations.ts

/** An interface and a list of wrappers that implement the interface */
export interface InterfaceImplementations {
  /** Uri of interface */
  interface: Uri;

  /** Uris of implementations */
  implementations: Uri[];
}

// $end

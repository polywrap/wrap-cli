import { Uri } from ".";

// $start: Env.ts

/** A map of string-indexed, Msgpack-serializable environmental variables associated with a wrapper */
export interface Env {
  /** Uri of wrapper */
  uri: Uri;

  /** Env variables used by the module */
  env: Record<string, unknown>;
}
// $end

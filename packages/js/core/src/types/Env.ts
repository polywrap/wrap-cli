import { Uri } from ".";

export interface Env {
  /** Uri of wrapper */
  uri: Uri;

  /** Env variables used by the module */
  env: Record<string, unknown>;
}

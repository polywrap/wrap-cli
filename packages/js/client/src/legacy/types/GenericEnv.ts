import { Uri } from "@polywrap/core-js";

export interface GenericEnv<TUri extends Uri | string = string> {
  /** Uri of wrapper */
  uri: TUri;

  /** Env variables used by the module */
  env: Record<string, unknown>;
}

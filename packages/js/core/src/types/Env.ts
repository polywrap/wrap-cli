import { Uri } from ".";

import { Tracer } from "@web3api/tracing-js";

export interface Env<TUri = string> {
  /** Uri of Web3Api */
  uri: TUri;

  /** Env variables shared by both mutation and query */
  module?: Record<string, unknown>;
}

export const sanitizeEnvs = Tracer.traceFunc(
  "core: sanitizeEnvs",
  (environments: Env[]): Env<Uri>[] => {
    const output: Env<Uri>[] = [];

    for (const env of environments) {
      output.push({
        ...env,
        uri: new Uri(env.uri),
      });
    }

    return output;
  }
);

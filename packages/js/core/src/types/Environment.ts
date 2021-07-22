import { Uri } from ".";

import { Tracer } from "@web3api/tracing-js";

export interface Environment<TUri = string> {
  /** Uri of Web3Api */
  uri: TUri;

  /** Environment variables shared by both mutation and query */
  common?: Record<string, unknown>;

  /** Environment variables specific to mutation module */
  mutation?: Record<string, unknown>;

  /** Environment variables specific to query module */
  query?: Record<string, unknown>;
}

export const sanitizeEnvironments = Tracer.traceFunc(
  "core: sanitizeEnviroments",
  (environments: Environment[]): Environment<Uri>[] => {
    const output: Environment<Uri>[] = [];

    for (const env of environments) {
      output.push({
        ...env,
        uri: new Uri(env.uri),
      });
    }

    return output;
  }
);

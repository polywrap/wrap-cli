import { Uri } from ".";

export interface Env<TUri extends Uri | string = string> {
  /** Uri of wrapper */
  uri: TUri;

  /** Env variables used by the module */
  env: Record<string, unknown>;
}

export const sanitizeEnvs = (environments: Env<Uri | string>[]): Env<Uri>[] => {
  const output: Env<Uri>[] = [];

  for (const env of environments) {
    output.push({
      ...env,
      uri: Uri.from(env.uri),
    });
  }

  return output;
};

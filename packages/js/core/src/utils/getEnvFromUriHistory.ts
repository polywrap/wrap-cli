import { Uri, CoreClient, Env } from "../types";

export const getEnvFromUriHistory = (
  uriHistory: Uri[],
  client: CoreClient
): Env | undefined => {
  for (const uri of uriHistory) {
    const env = client.getEnvByUri(uri);

    if (env) {
      return env;
    }
  }

  return undefined;
};

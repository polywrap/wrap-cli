import { Uri, CoreClient, WrapperEnv } from "../types";

export const getEnvFromUriHistory = (
  uriHistory: Uri[],
  client: CoreClient
): Readonly<WrapperEnv> | undefined => {
  for (const uri of uriHistory) {
    const env = client.getEnvByUri(uri);

    if (env) {
      return env;
    }
  }

  return undefined;
};

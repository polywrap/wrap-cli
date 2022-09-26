import { Uri, Client, Env } from "../types";

export const getEnvFromUriHistory = (
  uriHistory: Uri[],
  client: Client
): Env<Uri> | undefined => {
  for (const uri of uriHistory) {
    const env = client.getEnvByUri(uri);

    if (env) {
      return env;
    }
  }

  return undefined;
};

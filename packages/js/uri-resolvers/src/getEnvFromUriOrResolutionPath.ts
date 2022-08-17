import { Uri, IUriResolutionStep, Client, Env } from "@polywrap/core-js";

export const getEnvFromUriOrResolutionPath = (
  uri: Uri,
  resolutionPath: IUriResolutionStep<unknown>[],
  client: Client
): Env<Uri> | undefined => {
  const env = client.getEnvByUri(uri, {});

  if (env) {
    return env;
  }

  for (const { sourceUri } of resolutionPath) {
    const env = client.getEnvByUri(sourceUri, {});

    if (env) {
      return env;
    }
  }

  return undefined;
};

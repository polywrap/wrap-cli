import { Client, Env, Uri } from "../../types";
import { UriResolutionStack } from "../core";

export const getEnvFromUriOrResolutionStack = (
  uri: Uri,
  resolutionPath: UriResolutionStack,
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

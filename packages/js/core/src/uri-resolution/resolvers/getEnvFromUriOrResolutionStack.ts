import { Client, Env, Uri } from "../../types";
import { UriResolutionStack } from "../core";

export const getEnvFromUriOrResolutionStack = (
  uri: Uri,
  resolutionPath: UriResolutionStack,
  client: Client,
): Env<Uri> | undefined => {
  console.log("env", uri.uri);

  let env = client.getEnvByUri(uri, {});

  if(env) {
    console.log("Found env")
    return env;
  }

  for (const { sourceUri } of resolutionPath) {
    console.log("env", sourceUri.uri);
    const env = client.getEnvByUri(sourceUri, {});

    if (env) {
      console.log("Found env")
      return env;
    }
  }

  return undefined;
};

import { Tracer } from "@web3api/tracing-js";
import { UriResolver } from "../../../interfaces";
import { DeserializeManifestOptions, deserializeWeb3ApiManifest } from "../../../manifest";
import { Uri, Client, InvokeHandler, Env } from "../../../types";
import { IUriToApiResolver, UriResolutionStack, UriResolutionResult } from "../../core";
import { CreateApiFunc } from "./types/CreateApiFunc";

export class ApiResolver implements IUriToApiResolver {
  constructor(
    public readonly resolverUri: Uri,
    private readonly createApi: CreateApiFunc,
    private readonly deserializeOptions?: DeserializeManifestOptions
  ) {}

  name = "Api";

  async resolveUri(uri: Uri, client: Client, resolutionStack: UriResolutionStack): Promise<UriResolutionResult> {
    const result = await tryResolveUriWithUriResolver(
      uri, 
      this.resolverUri, 
      client.invoke.bind(client)
    );

    if (!result) {
      return {
        uri
      };
    }

    if (result.uri) {
      return {
        uri: new Uri(result.uri)
      };
    } else if (result.manifest) {
      // We've found our manifest at the current URI resolver
      // meaning the URI resolver can also be used as an API resolver
      const manifest = deserializeWeb3ApiManifest(
        result.manifest,
        this.deserializeOptions
      );

      const environment = getEnvironmentFromResolutionStack(client, resolutionStack);
      const api = this.createApi(uri, manifest, this.resolverUri, environment);
    
      return {
        uri,
        api
      };
    }
    
    return {
      uri
    };
  }
}

const tryResolveUriWithUriResolver = async (
  uri: Uri,
  uriResolver: Uri,
  invoke: InvokeHandler["invoke"],
): Promise<UriResolver.MaybeUriOrManifest | undefined> => {
  const { data } = await UriResolver.Query.tryResolveUri(
    invoke,
    uriResolver,
    uri
  );

  // If nothing was returned, the URI is not supported
  if (!data || (!data.uri && !data.manifest)) {
    Tracer.addEvent("continue", uriResolver.uri);
    return undefined;
  }

  return data;
};

const getEnvironmentFromResolutionStack = (
  client: Client, 
  resolutionStack: UriResolutionStack
): Env<Uri> | undefined => {
  for(const { sourceUri } of resolutionStack) {
    const environment = client.getEnvByUri(sourceUri, {});
    
    if(environment) {
      return environment;
    }
  }

  return undefined;
};
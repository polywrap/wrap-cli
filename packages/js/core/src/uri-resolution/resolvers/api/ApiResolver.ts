import { UriResolver } from "../../../interfaces";
import {
  DeserializeManifestOptions,
  deserializeWeb3ApiManifest,
} from "../../../manifest";
import { Uri, ApiCache, Client, InvokeHandler } from "../../../types";
import {
  UriToApiResolver,
  UriResolutionStack,
  UriResolutionResult,
} from "../../core";
import { CreateApiFunc } from "./types/CreateApiFunc";
import { getEnvFromUriOrResolutionStack } from "../getEnvFromUriOrResolutionStack";

import { Tracer } from "@web3api/tracing-js";

export class ApiResolver implements UriToApiResolver {
  constructor(
    public readonly resolverUri: Uri,
    private readonly createApi: CreateApiFunc,
    private readonly deserializeOptions?: DeserializeManifestOptions
  ) {}

  public get name(): string {
    return ApiResolver.name;
  }

  async resolveUri(
    uri: Uri,
    client: Client,
    cache: ApiCache,
    resolutionPath: UriResolutionStack
  ): Promise<UriResolutionResult> {
    const result = await tryResolveUriWithUriResolver(
      uri,
      this.resolverUri,
      client.invoke.bind(client)
    );

    if (!result) {
      return {
        uri,
      };
    }

    if (result.uri) {
      return {
        uri: new Uri(result.uri),
      };
    } else if (result.manifest) {
      // We've found our manifest at the current URI resolver
      // meaning the URI resolver can also be used as an API resolver
      const manifest = deserializeWeb3ApiManifest(
        result.manifest,
        this.deserializeOptions
      );

      const environment = getEnvFromUriOrResolutionStack(
        uri,
        resolutionPath,
        client
      );
      const api = this.createApi(uri, manifest, this.resolverUri, environment);

      return {
        uri,
        api,
      };
    }

    return {
      uri,
    };
  }
}

const tryResolveUriWithUriResolver = async (
  uri: Uri,
  uriResolver: Uri,
  invoke: InvokeHandler["invoke"]
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

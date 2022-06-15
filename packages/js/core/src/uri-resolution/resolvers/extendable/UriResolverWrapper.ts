import { UriResolverInterface } from "../../../interfaces";
import {
  DeserializeManifestOptions,
  deserializeWeb3ApiManifest,
} from "../../../manifest";
import { Uri, ApiCache, Client, InvokeHandler } from "../../../types";
import {
  UriResolver,
  UriResolutionStack,
  UriResolutionResult,
} from "../../core";
import { CreateApiFunc } from "./types/CreateApiFunc";
import { getEnvFromUriOrResolutionStack } from "../getEnvFromUriOrResolutionStack";

import { Tracer } from "@polywrap/tracing-js";

export class UriResolverWrapper implements UriResolver {
  constructor(
    public readonly implementationUri: Uri,
    private readonly createApi: CreateApiFunc,
    private readonly deserializeOptions?: DeserializeManifestOptions
  ) {}

  public get name(): string {
    return UriResolverWrapper.name;
  }

  async resolveUri(
    uri: Uri,
    client: Client,
    cache: ApiCache,
    resolutionPath: UriResolutionStack
  ): Promise<UriResolutionResult> {
    const result = await tryResolveUriWithImplementation(
      uri,
      this.implementationUri,
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
      // We've found our manifest at the current implementation,
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
      const api = this.createApi(
        uri,
        manifest,
        this.implementationUri.uri,
        environment
      );

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

const tryResolveUriWithImplementation = async (
  uri: Uri,
  implementationUri: Uri,
  invoke: InvokeHandler["invoke"]
): Promise<UriResolverInterface.MaybeUriOrManifest | undefined> => {
  const { data } = await UriResolverInterface.Query.tryResolveUri(
    invoke,
    implementationUri,
    uri
  );

  // If nothing was returned, the URI is not supported
  if (!data || (!data.uri && !data.manifest)) {
    Tracer.addEvent("continue", implementationUri.uri);
    return undefined;
  }

  return data;
};

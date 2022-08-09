import { UriResolverInterface } from "../../interfaces";
import { Uri, WrapperCache, Client } from "../../types";
import {
  IUriResolver,
  IUriResolutionStep,
  IUriResolutionResult,
} from "../core";
import { CreateWrapperFunc } from "./extendable/types/CreateWrapperFunc";
import { getEnvFromUriOrResolutionPath } from "./getEnvFromUriOrResolutionPath";

import {
  DeserializeManifestOptions,
  deserializeWrapManifest,
} from "@polywrap/wrap-manifest-types-js";
import { Tracer } from "@polywrap/tracing-js";

export class UriResolverWrapper implements IUriResolver {
  constructor(
    public readonly implementationUri: Uri,
    private readonly createWrapper: CreateWrapperFunc,
    private readonly deserializeOptions?: DeserializeManifestOptions
  ) {}

  public get name(): string {
    return `${UriResolverWrapper.name}: (${this.implementationUri.uri})`;
  }

  async tryResolveToWrapper(
    uri: Uri,
    client: Client,
    cache: WrapperCache,
    resolutionPath: IUriResolutionStep[]
  ): Promise<IUriResolutionResult> {
    const { uriOrManifest, error } = await tryResolveUriWithImplementation(
      uri,
      this.implementationUri,
      client
    );

    if (!uriOrManifest) {
      console.log(
        "wrapper - tryResolveToWrapper - error" + this.implementationUri.uri
      );
      return {
        uri,
        error,
      };
    }

    console.log("else" + this.implementationUri.uri);

    if (uriOrManifest.uri) {
      return {
        uri: new Uri(uriOrManifest.uri),
      };
    } else if (uriOrManifest.manifest) {
      // We've found our manifest at the current implementation,
      // meaning the URI resolver can also be used as an Wrapper resolver
      const manifest = await deserializeWrapManifest(
        uriOrManifest.manifest,
        this.deserializeOptions
      );

      const environment = getEnvFromUriOrResolutionPath(
        uri,
        resolutionPath,
        client
      );
      const wrapper = this.createWrapper(
        uri,
        manifest,
        this.implementationUri.uri,
        environment
      );

      return {
        uri,
        wrapper,
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
  client: Client
): Promise<{
  uriOrManifest?: UriResolverInterface.MaybeUriOrManifest;
  error?: unknown;
}> => {
  const { error: resolutionError, wrapper } = await client.tryResolveToWrapper(
    implementationUri
  );

  if (!wrapper) {
    console.log("ahhahahah");
    return {
      error: resolutionError,
    };
  }

  const result = await wrapper.invoke<UriResolverInterface.MaybeUriOrManifest>(
    {
      uri: implementationUri,
      method: "tryResolveUri",
      args: {
        authority: uri.authority,
        path: uri.path,
      },
    },
    client
  );

  console.log(`xxxxx - ${implementationUri.uri}`, result);

  const { data: uriOrManifest, error } = result;

  // If nothing was returned, the URI is not supported
  if (!uriOrManifest || (!uriOrManifest.uri && !uriOrManifest.manifest)) {
    Tracer.addEvent("continue", implementationUri.uri);
    return {
      error: error,
    };
  }

  return {
    uriOrManifest,
  };
};

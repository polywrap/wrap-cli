import { UriResolverInterface } from "../../interfaces";
import { Uri, WrapperCache, Client, Invoker } from "../../types";
import {
  IUriResolver,
  IUriResolutionStep,
  IUriResolutionResult,
  IUriResolutionError,
  UriResolutionErrorType,
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
    const result = await tryResolveUriWithImplementation(
      uri,
      this.implementationUri,
      client,
      client
    );

    console.log("xa" + this.implementationUri.uri);
    if ((result as IUriResolutionError).type) {
      console.log("if" + this.implementationUri.uri);
      return {
        uri,
        error: result as IUriResolutionError,
      };
    }
    console.log("else" + this.implementationUri.uri);

    const uriOrManifest = result as UriResolverInterface.MaybeUriOrManifest;

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
  invoker: Invoker,
  client: Client
): Promise<UriResolverInterface.MaybeUriOrManifest | IUriResolutionError> => {
  const { error: resolutionError } = await client.tryResolveToWrapper(
    implementationUri
  );

  if (resolutionError) {
    console.log("ahhahahah");
    return resolutionError;
  }
  const result = await UriResolverInterface.module.tryResolveUri(
    invoker,
    implementationUri,
    uri
  );

  console.log(`xxxxx - ${implementationUri.uri}`, result);

  const { data, error } = result;

  // If nothing was returned, the URI is not supported
  if (!data || (!data.uri && !data.manifest)) {
    Tracer.addEvent("continue", implementationUri.uri);
    return {
      type: UriResolutionErrorType.UriResolver,
      error: error,
    } as IUriResolutionError;
  }

  return data;
};

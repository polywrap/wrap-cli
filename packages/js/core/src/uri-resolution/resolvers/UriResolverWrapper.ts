import { UriResolverInterface } from "../../interfaces";
import { Uri, WrapperCache, Client, Result, Ok, Err, Wrapper } from "../..";
import { IUriResolver, IUriResolutionStep, UriResolutionResult } from "../core";
import { CreateWrapperFunc } from "./extendable/types/CreateWrapperFunc";
import { getEnvFromUriOrResolutionPath } from "./getEnvFromUriOrResolutionPath";

import {
  DeserializeManifestOptions,
  deserializeWrapManifest,
} from "@polywrap/wrap-manifest-types-js";
import { Tracer } from "@polywrap/tracing-js";
import { initWrapper, IWrapPackage } from "../../types";

export class UriResolverWrapper implements IUriResolver<unknown> {
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
  ): Promise<Result<UriResolutionResult, unknown>> {
    const result = await tryResolveUriWithImplementation(
      uri,
      this.implementationUri,
      client
    );

    if (!result.ok) {
      console.log(
        "wrapper - tryResolveToWrapper - error" + this.implementationUri.uri
      );
      return Err(result.error);
    }

    const uriOrManifest = result.value;

    console.log("else" + this.implementationUri.uri);

    if (uriOrManifest.uri) {
      return Ok(new UriResolutionResult(uriOrManifest as Uri));
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

      return Ok(new UriResolutionResult(wrapper));
    }

    return Ok(new UriResolutionResult(uri));
  }
}

const tryResolveUriWithImplementation = async (
  uri: Uri,
  implementationUri: Uri,
  client: Client
): Promise<Result<UriResolverInterface.MaybeUriOrManifest, unknown>> => {
  const result = await client.tryResolveToWrapper(implementationUri);

  if (!result.ok) {
    console.log("tryResolveUriWithImplementation - error");
    return Err(result.error);
  }

  if (result.value.uri()) {
    return Err(`Could not find URI: ${result.value.uri()}`);
  }

  const packageOrWrapper = result.value.response;

  const wrapper = await initWrapper(
    packageOrWrapper as IWrapPackage | Wrapper,
    client
  );

  const invokeResult = await wrapper.invoke<UriResolverInterface.MaybeUriOrManifest>(
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

  const { data: uriOrManifest, error } = invokeResult;

  // If nothing was returned, the URI is not supported
  if (!uriOrManifest || (!uriOrManifest.uri && !uriOrManifest.manifest)) {
    Tracer.addEvent("continue", implementationUri.uri);
    return Err(error);
  }

  return Ok(uriOrManifest);
};

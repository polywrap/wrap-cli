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
import { UriResolutionResponse } from "../core/UriResolutionResponse";

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
    resolutionPath: IUriResolutionStep<unknown>[]
  ): Promise<UriResolutionResult<unknown>> {
    const result = await tryResolveUriWithImplementation(
      uri,
      this.implementationUri,
      client
    );

    if (!result.ok) {
      console.log(
        "wrapper - tryResolveToWrapper - error" + this.implementationUri.uri
      );
      return {
        response: Err(result.error),
      };
    }

    const uriOrManifest = result.value;

    console.log("else" + this.implementationUri.uri);

    if (uriOrManifest.uri) {
      return {
        response: Ok(new UriResolutionResponse(uriOrManifest as Uri)),
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
        response: Ok(new UriResolutionResponse(wrapper)),
      };
    }

    return {
      response: Ok(new UriResolutionResponse(uri)),
    };
  }
}

const tryResolveUriWithImplementation = async (
  uri: Uri,
  implementationUri: Uri,
  client: Client
): Promise<Result<UriResolverInterface.MaybeUriOrManifest, unknown>> => {
  const result = await client.tryResolveToWrapper(implementationUri);

  if (!result.response.ok) {
    console.log("tryResolveUriWithImplementation - error");
    return Err(result.response.error);
  }

  const uriWrapperOrPackage = result.response.value;

  if (uriWrapperOrPackage.uri) {
    return Err(`Could not find URI: ${uriWrapperOrPackage.uri}`);
  }

  const wrapperOrPackage = uriWrapperOrPackage as IWrapPackage | Wrapper;

  const wrapper = await initWrapper(wrapperOrPackage, client);

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

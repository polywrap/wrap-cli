import { UriResolverInterface } from "../../interfaces";
import { Uri, WrapperCache, Client, Result, Ok, Err, Wrapper } from "../..";
import {
  IUriResolver,
  IUriResolutionStep,
  IUriResolutionResponse,
  UriResolutionResponse,
} from "../core";
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
    resolutionPath: IUriResolutionStep<unknown>[]
  ): Promise<IUriResolutionResponse<unknown>> {
    const { result, history } = await tryResolveUriWithImplementation(
      uri,
      this.implementationUri,
      client
    );

    if (!result.ok) {
      return UriResolutionResponse.err(result.error, history);
    }

    const uriOrManifest = result.value;

    if (uriOrManifest?.uri) {
      return UriResolutionResponse.ok(new Uri(uriOrManifest.uri), history);
    } else if (uriOrManifest?.manifest) {
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

      return UriResolutionResponse.ok(wrapper, history);
    }

    return UriResolutionResponse.ok(uri, history);
  }
}

const tryResolveUriWithImplementation = async (
  uri: Uri,
  implementationUri: Uri,
  client: Client
): Promise<{
  result: Result<UriResolverInterface.MaybeUriOrManifest | undefined, unknown>;
  history?: IUriResolutionStep<unknown>[];
}> => {
  const response = await client.tryResolveToWrapper(implementationUri);

  if (!response.result.ok) {
    return {
      result: Err(response.result.error),
      history: response.history,
    };
  }

  const uriPackageOrWrapper = response.result.value;

  if (uriPackageOrWrapper.type === "uri") {
    const lastFoundUri = uriPackageOrWrapper.uri as Uri;

    return {
      result: Err(
        `While resolving ${uri.uri} with URI resolver extension ${implementationUri.uri}, the extension could not be fully resolved. Last found URI is ${lastFoundUri.uri}`
      ),
      history: response.history,
    };
  }

  let wrapperOrPackage: IWrapPackage | Wrapper;

  if (uriPackageOrWrapper.type === "package") {
    wrapperOrPackage = uriPackageOrWrapper.package;
  } else {
    wrapperOrPackage = uriPackageOrWrapper.wrapper;
  }

  const wrapper = await initWrapper(wrapperOrPackage, client);

  const invokeResult = await client.invokeWrapper<UriResolverInterface.MaybeUriOrManifest>(
    {
      wrapper,
      uri: implementationUri.uri,
      method: "tryResolveUri",
      args: {
        authority: uri.authority,
        path: uri.path,
      },
    }
  );

  const { data, error } = invokeResult;

  const uriOrManifest = data as UriResolverInterface.MaybeUriOrManifest;

  if (error) {
    return {
      result: Err(error),
      history: [],
    };
  }
  Tracer.addEvent("continue", implementationUri.uri);

  return {
    result: Ok(uriOrManifest ?? undefined),
    history: [],
  };
};

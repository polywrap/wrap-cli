import { UriResolverExtensionFileReader } from "./UriResolverExtensionFileReader";

import {
  IUriResolver,
  Uri,
  Client,
  IUriResolutionResponse,
  UriResolutionResponse,
  UriResolverInterface,
  IUriResolutionStep,
  IWrapPackage,
  Wrapper,
  initWrapper,
} from "@polywrap/core-js";
import { Result, ResultOk, ResultErr } from "@polywrap/result";
import { WasmPackage } from "@polywrap/wasm-js";
import { getUriHistory } from "@polywrap/uri-resolvers-js";

export class UriResolverWrapper implements IUriResolver<unknown> {
  constructor(public readonly implementationUri: Uri) {}

  public get name(): string {
    return `UriResolverWrapper: (${this.implementationUri.uri})`;
  }

  async tryResolveUri(
    uri: Uri,
    client: Client
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
      const wrapPackage = WasmPackage.from(
        uri,
        uriOrManifest.manifest,
        new UriResolverExtensionFileReader(this.implementationUri, uri, client)
      );

      return UriResolutionResponse.ok(wrapPackage, history);
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
  const response = await client.tryResolveUri({ uri: implementationUri });

  if (!response.result.ok) {
    return {
      result: ResultErr(response.result.error),
      history: response.history,
    };
  }

  const uriPackageOrWrapper = response.result.value;

  if (uriPackageOrWrapper.type === "uri") {
    const lastFoundUri = uriPackageOrWrapper.uri as Uri;

    return {
      result: ResultErr(
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

  const uriHistory: Uri[] = !response.history
    ? [uri]
    : [uri, ...getUriHistory(response.history)];

  const wrapper = await initWrapper(wrapperOrPackage, client, uriHistory);

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
      result: ResultErr(error),
      history: [],
    };
  }

  return {
    result: ResultOk(uriOrManifest ?? undefined),
    history: [],
  };
};

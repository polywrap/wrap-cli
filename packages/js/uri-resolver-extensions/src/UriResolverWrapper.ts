import { UriResolverExtensionFileReader } from "./UriResolverExtensionFileReader";
import { loadResolverExtension } from "./ResolverExtensionLoader";

import {
  Uri,
  CoreClient,
  UriResolverInterface,
  IUriResolutionContext,
  UriPackageOrWrapper,
  getEnvFromUriHistory,
} from "@polywrap/core-js";
import { Result, ResultOk } from "@polywrap/result";
import { WasmPackage } from "@polywrap/wasm-js";
import {
  ResolverWithHistory,
  UriResolutionResult,
} from "@polywrap/uri-resolvers-js";

export class UriResolverWrapper extends ResolverWithHistory<unknown> {
  constructor(public readonly implementationUri: Uri) {
    super();
  }

  protected getStepDescription = (): string =>
    `ResolverExtension (${this.implementationUri.uri})`;

  protected async _tryResolveUri(
    uri: Uri,
    client: CoreClient,
    resolutionContext: IUriResolutionContext
  ): Promise<Result<UriPackageOrWrapper, unknown>> {
    const result = await tryResolveUriWithImplementation(
      uri,
      this.implementationUri,
      client,
      resolutionContext
    );

    if (!result.ok) {
      return UriResolutionResult.err(result.error);
    }

    const uriOrManifest = result.value;

    if (uriOrManifest?.uri) {
      return UriResolutionResult.ok(new Uri(uriOrManifest.uri));
    } else if (uriOrManifest?.manifest) {
      const wrapPackage = WasmPackage.from(
        uriOrManifest.manifest,
        new UriResolverExtensionFileReader(this.implementationUri, uri, client)
      );

      return UriResolutionResult.ok(uri, wrapPackage);
    }

    return UriResolutionResult.ok(uri);
  }
}

const tryResolveUriWithImplementation = async (
  uri: Uri,
  implementationUri: Uri,
  client: CoreClient,
  resolutionContext: IUriResolutionContext
): Promise<
  Result<UriResolverInterface.MaybeUriOrManifest | undefined, unknown>
> => {
  const subContext = resolutionContext.createSubContext();
  const result = await loadResolverExtension(
    uri,
    implementationUri,
    client,
    subContext
  );

  if (!result.ok) {
    return result;
  }

  const extensionWrapper = result.value;

  const env = getEnvFromUriHistory(subContext.getResolutionPath(), client);
  const invokeResult = await client.invokeWrapper<UriResolverInterface.MaybeUriOrManifest>(
    {
      wrapper: extensionWrapper,
      uri: implementationUri,
      method: "tryResolveUri",
      args: {
        authority: uri.authority,
        path: uri.path,
      },
      env: env?.env,
    }
  );

  if (!invokeResult.ok) {
    return invokeResult;
  }

  const uriOrManifest = invokeResult.value as UriResolverInterface.MaybeUriOrManifest;
  return ResultOk(uriOrManifest ?? undefined);
};

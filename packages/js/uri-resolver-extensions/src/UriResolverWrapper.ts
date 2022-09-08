import { UriResolverExtensionFileReader } from "./UriResolverExtensionFileReader";
import { loadResolverExtension } from "./ResolverExtensionLoader";

import {
  Uri,
  Client,
  UriResolverInterface,
  IUriResolutionContext,
  UriResolutionResult,
  UriPackageOrWrapper,
} from "@polywrap/core-js";
import { Result, ResultOk, ResultErr } from "@polywrap/result";
import { WasmPackage } from "@polywrap/wasm-js";
import { ResolverWithHistory } from "@polywrap/uri-resolvers-js";

export class UriResolverWrapper extends ResolverWithHistory<unknown> {
  constructor(public readonly implementationUri: Uri) {
    super();
  }

  protected getStepDescription = (): string =>
    `ResovlerExtension (${this.implementationUri.uri})`;

  protected async _tryResolveUri(
    uri: Uri,
    client: Client,
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
        uri,
        uriOrManifest.manifest,
        new UriResolverExtensionFileReader(this.implementationUri, uri, client)
      );

      return UriResolutionResult.ok(wrapPackage);
    }

    return UriResolutionResult.ok(uri);
  }
}

const tryResolveUriWithImplementation = async (
  uri: Uri,
  implementationUri: Uri,
  client: Client,
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

  const invokeResult = await client.invokeWrapper<UriResolverInterface.MaybeUriOrManifest>(
    {
      wrapper: extensionWrapper,
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
    return ResultErr(error);
  }

  return ResultOk(uriOrManifest ?? undefined);
};

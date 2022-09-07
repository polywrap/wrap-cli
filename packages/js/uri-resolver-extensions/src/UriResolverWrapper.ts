import { UriResolverExtensionFileReader } from "./UriResolverExtensionFileReader";

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
import { loadResolverExtension } from "./ResolverExtensionLoader";
import { ResolverWithHistory } from "@polywrap/uri-resolvers-js/build/base";

export class UriResolverWrapper extends ResolverWithHistory<unknown> {
  constructor(public readonly implementationUri: Uri) {
    super();
  }

  public get name(): string {
    return `UriResolverWrapper: (${this.implementationUri.uri})`;
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
  resolutionContext?: IUriResolutionContext
): Promise<
  Result<UriResolverInterface.MaybeUriOrManifest | undefined, unknown>
> => {
  const result = await loadResolverExtension(
    implementationUri,
    client,
    resolutionContext
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

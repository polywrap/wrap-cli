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

// $start: UriResolverWrapper
/**
 * An IUriResolver that delegates resolution to a wrapper that implements
 * the URI Resolver Extension Interface
 * */
export class UriResolverWrapper extends ResolverWithHistory<unknown> /* $ */ {
  // $start: UriResolverWrapper-constructor
  /**
   * construct a UriResolverWrapper
   *
   * @param implementationUri - URI that resolves to a URI Resolver Extension implementation
   * */
  constructor(public readonly implementationUri: Uri) /* $ */ {
    super();
  }

  // $start: UriResolverWrapper-getStepDescription
  /**
   * A utility function for generating step descriptions to facilitate resolution context updates
   *
   * @returns text describing the URI resolution step
   * */
  protected getStepDescription = (): string /* $ */ =>
    `ResolverExtension (${this.implementationUri.uri})`;

  // $start: UriResolverWrapper-_tryResolverUri
  /**
   * Attempt to resolve a URI by invoking a URI Resolver Extension wrapper, then
   * parse the result to a wrap package, a wrapper, or a URI
   *
   * @param uri - the URI to resolve
   * @param client - a CoreClient instance that may be used to invoke a wrapper that implements the UriResolver interface
   * @param resolutionContext - the current URI resolution context
   * @returns A Promise with a Result containing either a wrap package, a wrapper, or a URI if successful
   */
  protected async _tryResolveUri(
    uri: Uri,
    client: CoreClient,
    resolutionContext: IUriResolutionContext
  ): Promise<Result<UriPackageOrWrapper, unknown>> /* $ */ {
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

// $start: UriResolverWrapper-tryResolveUriWithImplementation
/**
 * Attempt to resolve a URI by invoking a URI Resolver Extension wrapper
 *
 * @param uri - the URI to resolve
 * @param implementationUri - URI that resolves to a URI Resolver Extension implementation
 * @param client - a CoreClient instance that will be used to invoke the URI Resolver Extension wrapper
 * @param resolutionContext - the current URI resolution context
 * @returns A Promise with a Result containing either URI or a manifest if successful
 */
const tryResolveUriWithImplementation = async (
  uri: Uri,
  implementationUri: Uri,
  client: CoreClient,
  resolutionContext: IUriResolutionContext
): Promise<
  Result<UriResolverInterface.MaybeUriOrManifest | undefined, unknown>
> /* $ */ => {
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

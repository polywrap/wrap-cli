import {
  Uri,
  WrapClient,
  Wrapper,
  UriResolutionContext,
} from "@polywrap/wrap-js";
import { Result, ResultErr, ResultOk } from "@polywrap/result";

/*
 * load a URI Resolver Extension wrapper, given a URI that resolves to it
 *
 * @param currentUri - The URI currently being resolved
 * @param resolverExtensionUri - A URI that resolves to the Resolver Extension
 * @param client - A WrapClient instance
 * @param resolutionContext - The current URI resolution context
 *
 * @returns a Result containing a Wrapper or an error
 * */
export const loadResolverExtension = async (
  currentUri: Uri,
  resolverExtensionUri: Uri,
  client: WrapClient,
  resolutionContext: UriResolutionContext
): Promise<Result<Wrapper, unknown>> => {
  const result = await client.tryResolveUri({
    uri: resolverExtensionUri,
    resolutionContext,
  });

  if (!result.ok) {
    return result;
  }

  const uriPackageOrWrapper = result.value;

  if (uriPackageOrWrapper.type === "uri") {
    const lastTriedUri = uriPackageOrWrapper.uri as Uri;

    return ResultErr(
      `While resolving ${currentUri.uri} with URI resolver extension ${resolverExtensionUri.uri}, the extension could not be fully resolved. Last tried URI is ${lastTriedUri.uri}`
    );
  }

  if (uriPackageOrWrapper.type === "package") {
    const result = await uriPackageOrWrapper.package.createWrapper();

    if (!result.ok) {
      return result;
    }

    return ResultOk(result.value);
  } else {
    return ResultOk(uriPackageOrWrapper.wrapper);
  }
};

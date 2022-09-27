import { Uri, Client, Wrapper, IUriResolutionContext } from "@polywrap/core-js";
import { Result, ResultErr, ResultOk } from "@polywrap/result";

export const loadResolverExtension = async (
  currentUri: Uri,
  resolverExtensionUri: Uri,
  client: Client,
  resolutionContext: IUriResolutionContext
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

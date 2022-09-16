import {
  Uri,
  Client,
  IWrapPackage,
  Wrapper,
  initWrapper,
  IUriResolutionContext,
} from "@polywrap/core-js";
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

  let wrapperOrPackage: IWrapPackage | Wrapper;

  if (uriPackageOrWrapper.type === "package") {
    wrapperOrPackage = uriPackageOrWrapper.package;
  } else {
    wrapperOrPackage = uriPackageOrWrapper.wrapper;
  }

  const wrapper = await initWrapper(wrapperOrPackage);

  return ResultOk(wrapper);
};

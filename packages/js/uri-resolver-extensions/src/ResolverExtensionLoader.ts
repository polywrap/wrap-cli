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
  uri: Uri,
  client: Client,
  resolutionContext?: IUriResolutionContext
): Promise<Result<Wrapper, unknown>> => {
  const result = await client.tryResolveUri({ uri, resolutionContext });

  if (!result.ok) {
    return result;
  }

  const uriPackageOrWrapper = result.value;

  if (uriPackageOrWrapper.type === "uri") {
    const lastFoundUri = uriPackageOrWrapper.uri as Uri;

    return ResultErr(
      `While resolving ${uri.uri} with URI resolver extension ${uri.uri}, the extension could not be fully resolved. Last found URI is ${lastFoundUri.uri}`
    );
  }

  let wrapperOrPackage: IWrapPackage | Wrapper;

  if (uriPackageOrWrapper.type === "package") {
    wrapperOrPackage = uriPackageOrWrapper.package;
  } else {
    wrapperOrPackage = uriPackageOrWrapper.wrapper;
  }

  const visitedUris: Uri[] = !resolutionContext
    ? [uri]
    : resolutionContext.getVisitedUris();

  const wrapper = await initWrapper(wrapperOrPackage, client, visitedUris);

  return ResultOk(wrapper);
};

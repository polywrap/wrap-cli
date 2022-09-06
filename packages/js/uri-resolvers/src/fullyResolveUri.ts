import {
  Uri,
  UriPackageOrWrapper,
  Client,
  IUriResolutionContext,
} from "@polywrap/core-js";
import { Result } from "@polywrap/result";

export const fullyResolveUri = async <TError>(
  uri: Uri,
  client: Client,
  resolutionContext: IUriResolutionContext | undefined,
  tryResolveUri: (
    uri: Uri,
    client: Client,
    resolutionContext?: IUriResolutionContext
  ) => Promise<Result<UriPackageOrWrapper, TError>>
): Promise<Result<UriPackageOrWrapper, TError>> => {
  let result = await tryResolveUri(uri, client, resolutionContext);

  if (result.ok && result.value.type === "uri") {
    const resultUri = result.value.uri;

    if (resultUri.uri !== uri.uri) {
      result = await tryResolveUri(resultUri, client, resolutionContext);
    }
  }

  return result;
};

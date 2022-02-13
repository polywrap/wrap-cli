import { ApiCache, Client, Uri } from "../../../types";
import { UriResolutionResult, UriResolutionStack } from ".";

export interface IUriToApiResolver {
  name: string;
  resolveUri(
    uri: Uri,
    client: Client,
    cache: ApiCache,
    resolutionPath: UriResolutionStack
  ): Promise<UriResolutionResult>;
}

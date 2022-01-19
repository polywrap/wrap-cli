import { Client, Uri } from "../../../types";
import { UriResolutionResult, UriResolutionStack } from ".";

export interface IUriToApiResolver {
  name: string;
  resolveUri(
    uri: Uri,
    client: Client,
    resolutionPath: UriResolutionStack
  ): Promise<UriResolutionResult>;
}

import { Client, Uri } from "../../../types";
import { UriResolutionResult, UriResolutionStack } from ".";

export interface IUriToApiResolver {
  name: string;
  resolveUri(
    uri: Uri,
    client: Client,
    resolutionStack: UriResolutionStack
  ): Promise<UriResolutionResult>;
}

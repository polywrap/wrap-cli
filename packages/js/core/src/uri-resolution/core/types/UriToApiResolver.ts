import { ApiCache, Client, Uri } from "../../../types";
import { UriResolutionResult, UriResolutionStack } from ".";

export abstract class UriToApiResolver {
  public abstract get name(): string;

  public abstract resolveUri(
    uri: Uri,
    client: Client,
    cache: ApiCache,
    resolutionPath: UriResolutionStack
  ): Promise<UriResolutionResult>;
}

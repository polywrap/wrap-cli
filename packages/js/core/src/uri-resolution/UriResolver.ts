import { WrapperCache, Client, Uri } from "../../../types";
import { UriResolutionResult, UriResolutionStack } from ".";

export abstract class UriResolver {
  public abstract get name(): string;

  public abstract resolveUri(
    uri: Uri,
    client: Client,
    cache: WrapperCache,
    resolutionPath: UriResolutionStack
  ): Promise<UriResolutionResult>;
}

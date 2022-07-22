import { WrapperCache, Client, Uri } from "../../../types";
import { ResolveUriResult, UriResolutionStep } from ".";

export abstract class UriResolver<TResolutionError> {
  public abstract get name(): string;

  public abstract tryResolveToWrapper(
    uri: Uri,
    client: Client,
    cache: WrapperCache,
    resolutionPath: UriResolutionStep[]
  ): Promise<ResolveUriResult<TResolutionError>>;
}

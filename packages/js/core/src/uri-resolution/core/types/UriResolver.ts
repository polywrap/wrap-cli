import { WrapperCache, Client, Uri } from "../../../types";
import { UriResolutionResult, UriResolutionStack } from ".";

import { DeserializeManifestOptions } from "@polywrap/wrap-manifest-types-js";

export abstract class UriResolver {
  public abstract get name(): string;

  public abstract resolveUri(
    uri: Uri,
    client: Client,
    cache: WrapperCache,
    resolutionPath: UriResolutionStack,
    deserializeOptions?: DeserializeManifestOptions
  ): Promise<UriResolutionResult>;
}

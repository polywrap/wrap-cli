import { Uri, CoreClient } from "..";
import { IUriResolutionContext } from "./IUriResolutionContext";
import { UriPackageOrWrapper } from "./UriPackageOrWrapper";

import { Result } from "@polywrap/result";

export interface IUriResolver<TError = undefined> {
  tryResolveUri(
    uri: Uri,
    client: CoreClient,
    resolutionContext: IUriResolutionContext
  ): Promise<Result<UriPackageOrWrapper, TError>>;
}

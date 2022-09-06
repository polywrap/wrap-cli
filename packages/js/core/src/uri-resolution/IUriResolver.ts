import { Result } from "@polywrap/result";
import { Uri, Client } from "..";
import { IUriResolutionContext } from "./IUriResolutionContext";
import { UriPackageOrWrapper } from "./UriPackageOrWrapper";

export interface IUriResolver<TError = undefined> {
  tryResolveUri(
    uri: Uri,
    client: Client,
    resolutionContext?: IUriResolutionContext
  ): Promise<Result<UriPackageOrWrapper, TError>>;
}
